use super::payments::{PayRent, Payment};

use anchor_lang::prelude::*;

pub const USDC_MINT_ADDRESS: &str = "CYXLacQvbrzV4W39AGcLXwM5BKVqJBLLui2xV8tVYdXd";

impl<'info> PayRent<'info> {
    pub fn payment_details(&mut self, rent: u64) -> Result<Payment> {
        let clock = Clock::get()?;
        let payment_date = clock.unix_timestamp;
        let payment = Payment {
            payment_id: 0,
            amount: rent,
            date: payment_date as u64,
        };
        Ok(payment)
    }
}
