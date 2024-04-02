use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub struct SecurityDeposit {
    pub amount: u64,
    pub initiated_date: u64,
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
// #[derive(Accounts)]
// pub struct InitiateSecurityDepositEscrow<'info> {
//     // #[account(seeds = [b"init-security-deposit", tenant.key.as_ref(), landlord.key.as_ref()], bump)]
//     // pub security_deposit_escrow_authority: UncheckedAccount<'info>, // Escrow account for the security deposit
//     // #[account(init_if_needed, payer = tenant, associated_token::mint = usdc_mint,
//     // associated_token::authority = security_deposit_escrow_authority)]
//     pub security_deposit_escrow: Account<'info, TokenAccount>,
//     #[account(mut)]
//     pub tenant: Signer<'info>,
//     #[account(mut)]
//     /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
//     pub landlord: AccountInfo<'info>,
//     /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
//     pub usdc_mint: AccountInfo<'info>,
//     /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
//     pub token_program: AccountInfo<'info>,
//     /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
//     pub associated_token_program: AccountInfo<'info>,
//     /// CHECK: ONLY READING AND NOT WRITING TO THIS ACCOUNT
//     pub system_program: AccountInfo<'info>,
// }

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
