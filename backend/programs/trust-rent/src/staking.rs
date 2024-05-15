use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;

/// Staking related structs
#[account]
pub struct Stake {
    pub stake_id: u64,
    pub landlord_address: Pubkey,
    pub amount: u64,
    pub initiated_date: i64,
    pub status: StakeStatus,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum StakeStatus {
    Initiated,
    InProgress,
    Completed,
}

#[account]
pub struct StakeOutcome {
    pub stake_outcome_id: u64,
    pub stake_id: u64,
    pub return_rate: u64, // in percentage
    pub duration: u64,    // in months or days
    pub status: StakeOutcomeStatus,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum StakeOutcomeStatus {
    Initiated,
    InProgress,
    Completed,
}

#[derive(Accounts)]
pub struct StakeSecurityDeposit<'info> {
    #[account(mut)]
    pub security_deposit_escrow: Account<'info, TokenAccount>,
    #[account(mut)]
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub company_wallet: AccountInfo<'info>,
    #[account(mut)]
    pub landlord: Signer<'info>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub token_program: AccountInfo<'info>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub system_program: AccountInfo<'info>,
}
#[derive(Accounts)]
pub struct RemoveSecurityDepositStake<'info> {
    #[account(mut)]
    pub security_deposit_escrow: Account<'info, TokenAccount>,
    #[account(mut)]
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub company_wallet: AccountInfo<'info>,
    #[account(mut)]
    pub landlord: Signer<'info>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub token_program: AccountInfo<'info>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct AddFundsToStaking<'info> {
    #[account(mut)]
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub company_wallet: AccountInfo<'info>,
    #[account(mut)]
    pub landlord: Signer<'info>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub token_program: AccountInfo<'info>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct RemoveFundsFromStaking<'info> {
    #[account(mut)]
    pub stake: Account<'info, StakeOutcome>,
    #[account(mut)]
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub company_wallet: AccountInfo<'info>,
    #[account(mut)]
    pub landlord: Signer<'info>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub token_program: AccountInfo<'info>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub system_program: AccountInfo<'info>,
}
