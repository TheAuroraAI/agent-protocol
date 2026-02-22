use anchor_lang::prelude::*;
use crate::state::{AgentProfile, Job, JobStatus};
use crate::error::AgentProtocolError;
use crate::events::JobDelegated;
use crate::constants::MAX_ACTIVE_CHILDREN;

#[derive(Accounts)]
#[instruction(description: String, delegation_amount: u64, timestamp_seed: i64)]
pub struct DelegateTask<'info> {
    #[account(mut)]
    pub delegating_agent: Signer<'info>,
    #[account(
        mut,
        constraint = parent_job.agent == delegating_agent.key() @ AgentProtocolError::Unauthorized,
        constraint = (
            parent_job.status == JobStatus::Pending ||
            parent_job.status == JobStatus::InProgress
        ) @ AgentProtocolError::InvalidJobStatus
    )]
    pub parent_job: Account<'info, Job>,
    #[account(
        constraint = sub_agent_profile.is_active @ AgentProtocolError::AgentNotActive
    )]
    pub sub_agent_profile: Account<'info, AgentProfile>,
    #[account(
        init,
        payer = delegating_agent,
        space = 8 + Job::INIT_SPACE,
        seeds = [
            b"job",
            delegating_agent.key().as_ref(),
            sub_agent_profile.key().as_ref(),
            &timestamp_seed.to_le_bytes()
        ],
        bump
    )]
    pub child_job: Account<'info, Job>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<DelegateTask>,
    description: String,
    delegation_amount: u64,
    timestamp_seed: i64,
) -> Result<()> {
    require!(!description.is_empty(), AgentProtocolError::EmptyDescription);
    require!(description.len() <= 256, AgentProtocolError::DescriptionTooLong);

    let parent = &mut ctx.accounts.parent_job;
    require!(
        parent.active_children < MAX_ACTIVE_CHILDREN,
        AgentProtocolError::TooManyDelegations
    );

    // Checked subtraction prevents underflow
    parent.escrow_lamports = parent.escrow_lamports
        .checked_sub(delegation_amount)
        .ok_or(AgentProtocolError::InsufficientEscrow)?;

    // Verify parent stays rent-exempt after escrow reduction
    let min_rent = Rent::get()?.minimum_balance(8 + Job::INIT_SPACE);
    let parent_info = parent.to_account_info();
    require!(
        parent_info.lamports() - delegation_amount >= min_rent,
        AgentProtocolError::InsufficientEscrow
    );

    parent.active_children = parent.active_children
        .checked_add(1)
        .ok_or(AgentProtocolError::Overflow)?;

    // Auto-flip parent to InProgress
    if parent.status == JobStatus::Pending {
        parent.status = JobStatus::InProgress;
    }

    // Move SOL from parent PDA to child PDA via direct lamport manipulation
    **parent_info.try_borrow_mut_lamports()? -= delegation_amount;
    let child_info = ctx.accounts.child_job.to_account_info();
    **child_info.try_borrow_mut_lamports()? += delegation_amount;

    let clock = Clock::get()?;
    let child = &mut ctx.accounts.child_job;
    child.client = ctx.accounts.delegating_agent.key();
    child.agent = ctx.accounts.sub_agent_profile.owner;
    child.escrow_lamports = delegation_amount;
    child.status = JobStatus::Pending;
    child.description = description;
    child.result_uri = String::new();
    child.parent_job = Some(ctx.accounts.parent_job.key());
    child.active_children = 0;
    child.auto_release_at = None;
    child.disputed_at = None;
    child.created_at = clock.unix_timestamp;
    child.completed_at = None;
    child.timestamp_seed = timestamp_seed;
    child.bump = ctx.bumps.child_job;

    emit!(JobDelegated {
        parent_job: ctx.accounts.parent_job.key(),
        child_job: child.key(),
        delegating_agent: ctx.accounts.delegating_agent.key(),
        sub_agent: ctx.accounts.sub_agent_profile.owner,
        amount: delegation_amount,
    });

    Ok(())
}
