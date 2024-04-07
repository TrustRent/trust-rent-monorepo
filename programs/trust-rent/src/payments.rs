use crate::agreement::rental_agreement::*;
use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{Mint, TokenAccount}};
use crate::utils::LOCAL_USDC_ADDRESS;

#[derive(AnchorDeserialize, AnchorSerialize, Default, Clone, Copy)]
pub struct Payment {
    pub payment_id: u64,
    pub amount: u64,
    pub date: u64,
}

#[derive(Accounts)]
pub struct WithdrawRentPayment<'info> {
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
#[instruction(rent: u64)]
pub struct PayRent<'info> {
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
