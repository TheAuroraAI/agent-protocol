use anchor_lang::prelude::*;
use crate::state::{Job, JobStatus};
use crate::error::AgentProtocolError;
use crate::events::JobCancelled;

#[derive(Accounts)]
pub struct CancelJob<'info> {
    #[account(
        mut,
        constraint = job.client == client.key() @ AgentProtocolError::Unauthorized
    )]
    pub client: Signer<'info>,
    #[account(
        mut,
        close = client
    )]
    pub job: Account<'info, Job>,
}

pub fn handler(ctx: Context<CancelJob>) -> Result<()> {
    let job = &mut ctx.accounts.job;
    require!(job.status == JobStatus::Pending, AgentProtocolError::InvalidJobStatus);

    let refund_amount = job.escrow_lamports;

    // Terminal state — account will be closed in same instruction
    job.status = JobStatus::Cancelled;
    job.escrow_lamports = 0;

    // Refund escrow to client via direct lamport manipulation
    let job_info = job.to_account_info();
    let client_info = ctx.accounts.client.to_account_info();
    **job_info.try_borrow_mut_lamports()? -= refund_amount;
    **client_info.try_borrow_mut_lamports()? += refund_amount;

    emit!(JobCancelled {
        job: ctx.accounts.job.key(),
        client: ctx.accounts.client.key(),
        refund_lamports: refund_amount,
    });

    Ok(())
}
