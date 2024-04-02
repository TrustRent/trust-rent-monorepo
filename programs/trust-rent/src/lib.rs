use anchor_lang::prelude::*;

declare_id!("J5KBZXVNtTEA1YWWztgk1MGcW9yzc8344FJvYxojDbsU");

#[program]
pub mod trust_rent {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
