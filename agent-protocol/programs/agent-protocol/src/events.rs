use anchor_lang::prelude::*;

#[event]
pub struct AgentRegistered {
    pub agent: Pubkey,
    pub owner: Pubkey,
    pub name: String,
    pub price_lamports: u64,
}

#[event]
pub struct JobCreated {
    pub job: Pubkey,
    pub client: Pubkey,
    pub agent: Pubkey,
    pub escrow_lamports: u64,
    pub auto_release_at: Option<i64>,
}

#[event]
pub struct JobCompleted {
    pub job: Pubkey,
    pub agent: Pubkey,
    pub result_uri: String,
}

#[event]
pub struct JobCancelled {
    pub job: Pubkey,
    pub client: Pubkey,
    pub refund_lamports: u64,
}

#[event]
pub struct JobDelegated {
    pub parent_job: Pubkey,
    pub child_job: Pubkey,
    pub delegating_agent: Pubkey,
    pub sub_agent: Pubkey,
    pub amount: u64,
}

#[event]
pub struct PaymentReleased {
    pub job: Pubkey,
    pub agent: Pubkey,
    pub amount: u64,
    pub auto_released: bool,
}

#[event]
pub struct DisputeRaised {
    pub job: Pubkey,
    pub raised_by: Pubkey,
}

#[event]
pub struct DisputeResolved {
    pub job: Pubkey,
    pub refund_lamports: u64,
}

#[event]
pub struct AgentRated {
    pub agent: Pubkey,
    pub rater: Pubkey,
    pub score: u8,
    pub new_avg_x100: u64,
}
