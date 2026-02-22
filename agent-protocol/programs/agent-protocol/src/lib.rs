use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod events;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("GEtqx8oSqZeuEnMKmXMPCiDsXuQBoVk1q72SyTWxJYUG");

#[program]
pub mod agent_protocol {
    use super::*;

    pub fn register_agent(
        ctx: Context<RegisterAgent>,
        name: String,
        description: String,
        capabilities: u16,
        price_lamports: u64,
    ) -> Result<()> {
        instructions::register_agent::handler(ctx, name, description, capabilities, price_lamports)
    }

    pub fn invoke_agent(
        ctx: Context<InvokeAgent>,
        description: String,
        payment_lamports: u64,
        auto_release_seconds: Option<i64>,
        timestamp_seed: i64,
    ) -> Result<()> {
        instructions::invoke_agent::handler(ctx, description, payment_lamports, auto_release_seconds, timestamp_seed)
    }

    pub fn update_job(ctx: Context<UpdateJob>, result_uri: String) -> Result<()> {
        instructions::update_job::handler(ctx, result_uri)
    }

    pub fn release_payment(ctx: Context<ReleasePayment>) -> Result<()> {
        instructions::release_payment::handler(ctx)
    }

    pub fn auto_release(ctx: Context<AutoRelease>) -> Result<()> {
        instructions::auto_release::handler(ctx)
    }

    pub fn cancel_job(ctx: Context<CancelJob>) -> Result<()> {
        instructions::cancel_job::handler(ctx)
    }

    pub fn delegate_task(
        ctx: Context<DelegateTask>,
        description: String,
        delegation_amount: u64,
        timestamp_seed: i64,
    ) -> Result<()> {
        instructions::delegate_task::handler(ctx, description, delegation_amount, timestamp_seed)
    }

    pub fn raise_dispute(ctx: Context<RaiseDispute>) -> Result<()> {
        instructions::raise_dispute::handler(ctx)
    }

    pub fn resolve_dispute_by_timeout(ctx: Context<ResolveDispute>) -> Result<()> {
        instructions::resolve_dispute::handler(ctx)
    }

    pub fn rate_agent(ctx: Context<RateAgent>, score: u8) -> Result<()> {
        instructions::rate_agent::handler(ctx, score)
    }
}
