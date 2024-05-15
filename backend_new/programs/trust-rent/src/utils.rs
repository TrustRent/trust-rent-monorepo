use super::payments::{PayRent, Payment};

use anchor_lang::prelude::*;
use solana_program::pubkey;

pub const DEV_USDC_ADDRESS: Pubkey = pubkey!("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
pub const LOCAL_USDC_ADDRESS: Pubkey = pubkey!("uSDCARvy87Kei3izvHJS3gzecBncTnAeEc2L4qhrJ7o");

impl<'info> PayRent<'info> {
    pub fn payment_details(&mut self, rent: u64) -> Result<Payment> {
        let clock = Clock::get()?;
        let payment_date = clock.unix_timestamp;
        let payment = Payment {
            payment_id: payment_date as u64 + rent,
            amount: rent,
            date: payment_date as u64,
        };
        Ok(payment)
    }
}
