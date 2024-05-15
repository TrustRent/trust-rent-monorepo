export interface RentalAgreement {
  paymentHistory: Array<Payment>;
  rentAmount: number;
  securityDeposit: SecurityDeposit;
  startDate: number;
  endDate: number;
}

interface Payment {
  paymentId: number;
  amount: number;
  date: number;
}

interface SecurityDeposit {
  amount: number;
  initiatedDate: number;
  paidDate: number;
  paymentStatus: string;
  status: string;
}
