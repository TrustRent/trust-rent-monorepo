use crate::{Payment, SecurityDeposit};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    mint,
    token::{Mint, Token, TokenAccount},
};

use solana_program::pubkey::Pubkey;

/// Rental agreement related structs
#[account]
pub struct RentalAgreement {
    pub landlord: Pubkey,
    pub tenant: Pubkey,
    pub agreement_pda: Pubkey,
    pub payment_collection_account: Pubkey,
    pub rent_amount: u64,
    pub start_date: u64,
    pub end_date: u64,
    pub security_deposit: SecurityDeposit,
    pub payment_history: [Payment; 12],
}

#[derive(Accounts)]
#[instruction(rent: u64, start_date: u64, end_date: u64)]
pub struct CreateRentalAgreement<'info> {
    #[account(init, payer = landlord, space = 8 + 128 + 24 + 288 + 100, seeds=[
        b"rental_agreement".as_ref(),
        landlord.key.as_ref(),
        tenant.key.as_ref(),
    ], bump)]
    pub rental_agreement: Account<'info, RentalAgreement>,
    #[account(init_if_needed, payer = landlord,associated_token::mint = usdc_mint, associated_token::authority = rental_agreement)]
    pub collection_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub landlord: Signer<'info>,
    /// CHECK: ONLY READING NOT WRITING
    #[account(address = mint::USDC)]
    pub usdc_mint: Account<'info, Mint>,
    /// CHECK: ONLY READING TO THIS ACCOUNT NOT WRITING
    pub tenant: AccountInfo<'info>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct UpdateRentalAgreement<'info> {
    #[account(mut)]
    pub rental_agreement: Account<'info, RentalAgreement>,
    #[account(mut)]
    pub landlord: Signer<'info>,
}

#[derive(Accounts)]
pub struct EndRentalAgreement<'info> {
    #[account(mut)]
    pub rental_agreement: Account<'info, RentalAgreement>,
    #[account(mut)]
    pub landlord: Signer<'info>,
}
