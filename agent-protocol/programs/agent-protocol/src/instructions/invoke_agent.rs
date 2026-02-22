use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::state::{AgentProfile, Job, JobStatus};
use crate::error::AgentProtocolError;
use crate::events::JobCreated;

#[derive(Accounts)]
#[instruction(description: String, payment_lamports: u64, auto_release_seconds: Option<i64>, timestamp_seed: i64)]
pub struct InvokeAgent<'info> {
    #[account(mut)]
    pub client: Signer<'info>,
    #[account(
        constraint = agent_profile.is_active @ AgentProtocolError::AgentNotActive
    )]
    pub agent_profile: Account<'info, AgentProfile>,
    #[account(
        init,
        payer = client,
        space = 8 + Job::INIT_SPACE,
        seeds = [
            b"job",
            client.key().as_ref(),
            agent_profile.key().as_ref(),
            &timestamp_seed.to_le_bytes()
        ],
        bump
    )]
    pub job: Account<'info, Job>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<InvokeAgent>,
    description: String,
    payment_lamports: u64,
    auto_release_seconds: Option<i64>,
    timestamp_seed: i64,
) -> Result<()> {
    require!(!description.is_empty(), AgentProtocolError::EmptyDescription);
    // Belt-and-suspenders: runtime length check on top of #[max_len(256)]
    require!(description.len() <= 256, AgentProtocolError::DescriptionTooLong);
    require!(
        payment_lamports >= ctx.accounts.agent_profile.price_lamports,
        AgentProtocolError::InsufficientPayment
    );

    let clock = Clock::get()?;

    // Transfer SOL from client to Job PDA (escrow)
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.client.to_account_info(),
                to: ctx.accounts.job.to_account_info(),
            },
        ),
        payment_lamports,
    )?;

    let auto_release_at = auto_release_seconds.map(|s| clock.unix_timestamp + s);

    let job = &mut ctx.accounts.job;
    job.client = ctx.accounts.client.key();
    job.agent = ctx.accounts.agent_profile.owner;
    job.escrow_lamports = payment_lamports;
    job.status = JobStatus::Pending;
    job.description = description;
    job.result_uri = String::new();
    job.parent_job = None;
    job.active_children = 0;
    job.auto_release_at = auto_release_at;
    job.disputed_at = None;
    job.created_at = clock.unix_timestamp;
    job.completed_at = None;
    job.timestamp_seed = timestamp_seed;
    job.bump = ctx.bumps.job;

    emit!(JobCreated {
        job: job.key(),
        client: ctx.accounts.client.key(),
        agent: ctx.accounts.agent_profile.owner,
        escrow_lamports: payment_lamports,
        auto_release_at,
    });

    Ok(())
}
