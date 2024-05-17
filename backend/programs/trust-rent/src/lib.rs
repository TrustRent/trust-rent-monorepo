pub mod agreement;
/// This is the backend for trust rent. It is broken into a few different modules
///
/// The create_rent_agreement, update_rent_agreement, and end_rent_agreement functions are used to
/// create, update, and end a rent agreement respectively. These will all interact with the PDA (escrow account)
/// originally created by the create_rent_agreement function. This PDA will be used to store the details of the
/// rental agreement as well as what holds the rent payment each month.
///
/// The initiate_security_deposit_escrow, stake_security_deposit, remove_security_deposit_stake, return_security_deposit,
/// and claim_security_deposit functions are used to manage the security deposit. The security deposit is stored in a PDA
/// and can be staked, removed, returned, or claimed by the landlord. This PDA is set up by the tenant when the landlord
/// requests the security deposit.
///
///
/// The add_funds_to_stake and remove_funds_from_stake functions are used to manage the amount of funds staked in the
/// off chain staking pool, these functions are specifically for non security deposit funds to include rent and any fees
/// incur there after.
///
/// The withdraw_rent_payment and pay_rent functions are used to manage the rent payments. The tenant can pay rent and the
/// landlord can withdraw the rent payment to their personal wallet.
pub mod errors;
pub mod payments;
pub mod security_deposit;
pub mod staking;
pub mod utils;
// use crate::agreement::agreement_processors::*;
use crate::agreement::rental_agreement::*;
use anchor_lang::prelude::*;
use errors::*;
use payments::*;
use security_deposit::*;
use staking::*;
use anchor_spl::{token, token::Transfer as SplTransfer, associated_token::get_associated_token_address};

declare_id!("YxJNQxxxtnduNvg4auJVq33AF4nn9pCKPi7HiVeGNsM");

#[program]
pub mod trust_rent {


    use super::*;

    // Need frontend function to create the PDA for the rental agreement with spots for landlord
    // to input info below
    pub fn create_rent_agreement(
        ctx: Context<CreateRentalAgreement>,
        rent_amount: u64,
        sd_amount: u64,
        start_date: u64,
        end_date: u64,
    ) -> Result<()> {
        let clock = Clock::get()?;
        let pda = ctx.accounts.rental_agreement.key();
        msg!("Creating rent agreement");
        if start_date >= end_date {
            return Err(TrustRentErrors::InvalidDates.into());
        }
        let collection_account = get_associated_token_address(&pda, &ctx.accounts.usdc_mint.key());
        msg!("Dates are valid");

        let agreement = &mut ctx.accounts.rental_agreement;
        msg!("Creating agreement");
        agreement.landlord = ctx.accounts.landlord.key();
        msg!("Landlord set");
        agreement.tenant = ctx.accounts.tenant.key();
        msg!("Tenant set");
        agreement.agreement_pda = pda;
        msg!("PDA set");
        agreement.payment_collection_account = collection_account;
        // ctx.accounts.collection_account.to_account_info().key();
        msg!("Collection account set");
        agreement.rent_amount = rent_amount;
        msg!("Rent amount set");
        agreement.start_date = start_date;
        msg!("Start date set");
        agreement.end_date = end_date;
        msg!("End date set");
        agreement.security_deposit = SecurityDeposit {
            amount: sd_amount,
            initiated_date: clock.unix_timestamp as u64,
            paid_date: 0,
            payment_status: SecurityDepositPaidStatus::Unpaid,
            status: SecurityDepositEscrowStatus::Unfunded,
        };
        msg!("Security deposit set");
        agreement.payment_history = [Payment {
            payment_id: 0,
            amount: 0,
            date: 0,
        }; 12];
        msg!("Payment history set");

        Ok(())
    }

    // Tenant can pay rent, need frontend function for this
    pub fn pay_rent(ctx: Context<PayRent>, amount: u64) -> Result<()> {
        let rent_amount = amount;
        let current_payment_details = crate::PayRent::payment_details(ctx.accounts, rent_amount)?;

        if ctx.accounts.payment_collection_account.key() != ctx.accounts.rental_agreement.payment_collection_account.key() {
            return Err(TrustRentErrors::InvalidPaymentAccount.into());
        }
        let agreement = &mut ctx.accounts.rental_agreement;
        if rent_amount < agreement.rent_amount {
            return Err(TrustRentErrors::InvalidRentAmount.into());
        }

        let destination = &ctx.accounts.payment_collection_account;
        let source = &ctx.accounts.tenant_usdc;
        let token_program = &ctx.accounts.token_program;
        let authority = &ctx.accounts.tenant;

        // Transfer tokens from taker to initializer
        let cpi_accounts = SplTransfer {
            from: source.to_account_info().clone(),
            to: destination.to_account_info().clone(),
            authority: authority.to_account_info().clone(),
        };
        let cpi_program = token_program.to_account_info();
        token::transfer(CpiContext::new(cpi_program, cpi_accounts), rent_amount)?;

        for (p, payment) in agreement.payment_history.iter_mut().enumerate() {
            if payment.payment_id == 0 {
                agreement.payment_history[p] = current_payment_details;
                break;
            }
        }

        // Pay rent
        // Update payment date
        // Return payment id -- figure out how to generate unique payment id
        Ok(())
    }
    pub fn pay_security_deposit(
        ctx: Context<PaySecurityDeposit>,
        amount: u64,
    ) -> Result<()> {
        let clock = Clock::get()?;
        let security_deposit_amount = amount;

        if ctx.accounts.payment_collection_account.key() != ctx.accounts.rental_agreement.payment_collection_account.key() {
            return Err(TrustRentErrors::InvalidPaymentAccount.into());
        }
        let agreement = &mut ctx.accounts.rental_agreement;
        if security_deposit_amount < agreement.security_deposit.amount {
            return Err(TrustRentErrors::InvalidSDAmount.into());
        }
        let destination = &ctx.accounts.payment_collection_account;
        let source = &ctx.accounts.tenant_usdc;
        let token_program = &ctx.accounts.token_program;
        let authority = &ctx.accounts.tenant;

        // Transfer tokens from taker to initializer
        let cpi_accounts = SplTransfer {
            from: source.to_account_info().clone(),
            to: destination.to_account_info().clone(),
            authority: authority.to_account_info().clone(),
        };
        let cpi_program = token_program.to_account_info();
        token::transfer(CpiContext::new(cpi_program, cpi_accounts), security_deposit_amount)?;

        agreement.security_deposit.paid_date = clock.unix_timestamp as u64;
        agreement.security_deposit.payment_status = SecurityDepositPaidStatus::Paid;
        agreement.security_deposit.status = SecurityDepositEscrowStatus::Escrowed;
        Ok(())
    }


    /// Need to finish and verify this function
    // Can leave this as Todo for now but eventually need this to be a button on the frontend
    pub fn update_rent_agreement(
        ctx: Context<UpdateRentalAgreement>,
        rent_amount: u64,
        start_date: u64,
        end_date: u64,
    ) -> Result<()> {
        if start_date >= end_date {
            return Err(TrustRentErrors::InvalidDates.into());
        }
        let agreement = &mut ctx.accounts.rental_agreement;

        if agreement.rent_amount != rent_amount {
            agreement.rent_amount = rent_amount;
        }
        if agreement.start_date != start_date {
            agreement.start_date = start_date;
        }
        if agreement.end_date != end_date {
            agreement.end_date = end_date;
        }

        Ok(())
    }

    /// Below here are all functions that need to be started.

    // Need front end function/button to end rent agreement
    pub fn end_rent_agreement(_ctx: Context<EndRentalAgreement>) -> Result<()> {
        todo!()
        // End a rent agreement
    }

    // Self explanatory
    pub fn stake_security_deposit(_ctx: Context<StakeSecurityDeposit>, _amount: f64) -> Result<()> {
        todo!()
        // Stake the security deposit
        // Update security deposit status to Staked
    }

    // Self explanatory
    pub fn remove_security_deposit_stake(
        _ctx: Context<RemoveSecurityDepositStake>,
        _amount: f64,
    ) -> Result<()> {
        todo!()
        // Remove the security deposit stake
        // Update security deposit status to Escrowed
    }

    // Self explanatory
    pub fn return_security_deposit(_ctx: Context<ReturnSecurityDeposit>) -> Result<()> {
        todo!()
        // Return the security deposit
        // Update security deposit status to Returned
    }

    // Landlord can claim part of all of security deposit in case of damages or other reasons
    // Need frontend function to allow this as well as a "review" mechanism maybe
    pub fn claim_security_deposit(_ctx: Context<ClaimSecurityDeposit>, _amount: u64) -> Result<()> {
        todo!()
        // Claim the security deposit
        // Update security deposit status to Claimed
    }

    // Need frontend function to add funds to stake
    pub fn add_funds_to_stake(_ctx: Context<AddFundsToStaking>, _amount: u64) -> Result<()> {
        todo!()
        // Add funds to stake
        // Update amount staked area
    }

    // Need frontend function to remove funds from stake
    pub fn remove_funds_from_stake(
        _ctx: Context<RemoveFundsFromStaking>,
        _amount: f64,
    ) -> Result<()> {
        todo!()
        // Remove funds from stake
        // Update amount staked area
    }

    // If landlord decides not to stake he can withdraw to wallet
    pub fn withdraw_rent_payment(_ctx: Context<WithdrawRentPayment>, _amount: u64) -> Result<()> {
        todo!()
        // Withdraw rent payment
    }
}
