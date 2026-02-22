use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Rating {
    pub agent: Pubkey,
    pub rater: Pubkey,
    pub job: Pubkey,
    pub score: u8,
    pub created_at: i64,
    pub bump: u8,
}
