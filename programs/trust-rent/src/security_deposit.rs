

use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{Mint, TokenAccount}};

use crate::{utils::LOCAL_USDC_ADDRESS, RentalAgreement};

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub struct SecurityDeposit {
    pub amount: u64,
    pub initiated_date: u64,
    pub paid_date: u64,
    pub payment_status: SecurityDepositPaidStatus,
    pub status: SecurityDepositEscrowStatus,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum SecurityDepositPaidStatus {
    Unpaid,
    Paid,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum SecurityDepositEscrowStatus {
    Unfunded,
    Escrowed,
    Returned,
    Claimed,
    Staked,
}

// Context Structs
#[derive(Accounts)]
pub struct PaySecurityDeposit<'info> {
    #[account(mut)]
    pub rental_agreement: Account<'info, RentalAgreement>,
    #[account(mut)]
    pub payment_collection_account: Account<'info, TokenAccount>,
    #[account(mut)]
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub landlord: AccountInfo<'info>,
    #[account(mut)]
    pub tenant: Signer<'info>,
    #[account(init_if_needed, payer = tenant,associated_token::mint = usdc_mint, associated_token::authority = tenant)]
    pub tenant_usdc: Account<'info, TokenAccount>,
    // #[account(address = mint::USDC)] // Mainnet
    #[account(address = LOCAL_USDC_ADDRESS)] // Localnet
    // #[account(address = DEV_USDC_ADDRESS)] // Devnet
    pub usdc_mint: Account<'info, Mint>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub token_program: AccountInfo<'info>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct ReturnSecurityDeposit<'info> {
    #[account(mut)]
    pub security_deposit_escrow: Account<'info, TokenAccount>,
    #[account(mut)]
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub tenant: AccountInfo<'info>,
    #[account(mut)]
    pub landlord_wallet: Signer<'info>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub token_program: AccountInfo<'info>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct ClaimSecurityDeposit<'info> {
    #[account(mut)]
    pub security_deposit_escrow: Account<'info, TokenAccount>,
    #[account(mut)]
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub tenant: AccountInfo<'info>,
    #[account(mut)]
    pub landlord_wallet: Signer<'info>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub token_program: AccountInfo<'info>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub system_program: AccountInfo<'info>,
}
