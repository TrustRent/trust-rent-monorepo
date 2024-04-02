use super::rental_agreement::RentalAgreement;
use anchor_lang::prelude::*;

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
pub struct PayRent<'info> {
    #[account(mut)]
    pub rental_agreement: Account<'info, RentalAgreement>,
    #[account(mut)]
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub landlord: AccountInfo<'info>,
    #[account(mut)]
    pub tenant_wallet: Signer<'info>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub token_program: AccountInfo<'info>,
    /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
    pub system_program: AccountInfo<'info>,
}
