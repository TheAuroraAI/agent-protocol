use anchor_lang::prelude::*;
use crate::state::{Job, JobStatus};
use crate::error::AgentProtocolError;
use crate::events::DisputeResolved;
use crate::constants::DISPUTE_TIMEOUT;

#[derive(Accounts)]
pub struct ResolveDispute<'info> {
    /// CHECK: Client receives refund. Validated against job.client.
    #[account(
        mut,
        constraint = job.client == client.key() @ AgentProtocolError::Unauthorized
    )]
    pub client: AccountInfo<'info>,
    #[account(
        mut,
        close = client
    )]
    pub job: Account<'info, Job>,
}

pub fn handler(ctx: Context<ResolveDispute>) -> Result<()> {
    let job = &mut ctx.accounts.job;
    require!(job.status == JobStatus::Disputed, AgentProtocolError::InvalidJobStatus);
    require!(job.disputed_at.is_some(), AgentProtocolError::InvalidJobStatus);

    let clock = Clock::get()?;
    require!(
        clock.unix_timestamp - job.disputed_at.unwrap() > DISPUTE_TIMEOUT,
        AgentProtocolError::DisputeTimeoutNotReached
    );

    let refund_amount = job.escrow_lamports;

    // Terminal state — account will be closed in same instruction
    job.status = JobStatus::Cancelled;
    job.escrow_lamports = 0;

    // Refund escrow to client via direct lamport manipulation
    let job_info = job.to_account_info();
    let client_info = ctx.accounts.client.to_account_info();
    **job_info.try_borrow_mut_lamports()? -= refund_amount;
    **client_info.try_borrow_mut_lamports()? += refund_amount;

    emit!(DisputeResolved {
        job: job.key(),
        refund_lamports: refund_amount,
    });

    Ok(())
}
