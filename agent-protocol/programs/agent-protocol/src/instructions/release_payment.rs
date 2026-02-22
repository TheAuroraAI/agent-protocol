use anchor_lang::prelude::*;
use crate::state::{AgentProfile, Job, JobStatus};
use crate::error::AgentProtocolError;
use crate::events::PaymentReleased;

#[derive(Accounts)]
pub struct ReleasePayment<'info> {
    #[account(
        mut,
        constraint = job.client == client.key() @ AgentProtocolError::Unauthorized
    )]
    pub client: Signer<'info>,
    /// CHECK: Agent wallet receives payment. Validated against job.agent.
    #[account(
        mut,
        constraint = job.agent == agent.key() @ AgentProtocolError::Unauthorized
    )]
    pub agent: AccountInfo<'info>,
    #[account(
        mut,
        constraint = agent_profile.owner == job.agent @ AgentProtocolError::Unauthorized
    )]
    pub agent_profile: Account<'info, AgentProfile>,
    #[account(mut)]
    pub job: Account<'info, Job>,
    /// Optional parent job — required when job.parent_job is Some
    #[account(mut)]
    pub parent_job: Option<Account<'info, Job>>,
}

pub fn handler(ctx: Context<ReleasePayment>) -> Result<()> {
    let job = &mut ctx.accounts.job;
    require!(job.status == JobStatus::Completed, AgentProtocolError::InvalidJobStatus);

    let escrow_amount = job.escrow_lamports;

    // Terminal state — account will be closed in same instruction
    job.status = JobStatus::Finalized;
    job.escrow_lamports = 0;

    // Transfer escrow to agent via direct lamport manipulation
    let job_info = job.to_account_info();
    let agent_info = ctx.accounts.agent.to_account_info();
    **job_info.try_borrow_mut_lamports()? -= escrow_amount;
    **agent_info.try_borrow_mut_lamports()? += escrow_amount;

    // Update agent stats
    let profile = &mut ctx.accounts.agent_profile;
    profile.jobs_completed = profile.jobs_completed
        .checked_add(1)
        .ok_or(AgentProtocolError::Overflow)?;

    // Handle parent decrement for child jobs
    if job.parent_job.is_some() {
        let parent = ctx.accounts.parent_job.as_mut()
            .ok_or(AgentProtocolError::ParentJobMismatch)?;
        require!(
            job.parent_job.unwrap() == parent.key(),
            AgentProtocolError::ParentJobMismatch
        );
        require!(parent.active_children > 0, AgentProtocolError::Overflow);
        parent.active_children = parent.active_children
            .checked_sub(1)
            .ok_or(AgentProtocolError::Overflow)?;
    }

    emit!(PaymentReleased {
        job: ctx.accounts.job.key(),
        agent: ctx.accounts.agent.key(),
        amount: escrow_amount,
        auto_released: false,
    });

    Ok(())
}
