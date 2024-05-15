use anchor_lang::error_code;

#[error_code]
pub enum TrustRentErrors {
    #[msg("The specified rent amount id invalid")]
    InvalidRentAmount,
    #[msg("The start date must be before the end date")]
    InvalidDates,
    #[msg("The specified payment account is invalid")]
    InvalidPaymentAccount,
    #[msg("The specified security deposit amount is invalid")]
    InvalidSDAmount,
}
