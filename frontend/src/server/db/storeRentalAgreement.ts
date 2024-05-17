import * as anchor from "@project-serum/anchor";

import { TrustRent } from "/Users/brandonrobb/Github_Projects/trust-rent-monorepo/backend/target/types/trust_rent";

import { getProgram, getProvider } from "~/components/web3Components/program";
import { PublicKey } from "@solana/web3.js";
import { db } from "./index";
import { rentalAgreements } from "./schema";

export const storeRentalAgreement = async (
  wallet: anchor.Wallet,
  tenantWallet: PublicKey,
) => {
  // Set up provider and program for sending blockchain tx
  const provider = getProvider(wallet);
  const program = getProgram(provider);
  let rentalAgreementAccount: anchor.IdlAccounts<TrustRent>["rentalAgreement"];

  // Create seeds and find the pdaPubkey to get the data account
  const seeds = [
    Buffer.from("rental-agreement"),
    wallet.publicKey.toBuffer(),
    tenantWallet.toBuffer(),
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pdaPubkey, _] = PublicKey.findProgramAddressSync(
    seeds,
    program.programId,
  );

  try {
    if (!program.account.rentalAgreement) return;
    rentalAgreementAccount =
      await program.account.rentalAgreement?.fetch(pdaPubkey);
  } catch (e) {
    return { message: "Cannot not find accounts" };
  }

  // Collect data to insert into database
  const landlord = rentalAgreementAccount.landlord.toString();
  const tenant = rentalAgreementAccount.tenant.toString();
  const paymentCollectionAccount =
    rentalAgreementAccount.paymentCollectionAccount.toString();
  const rent = rentalAgreementAccount.rentAmount.toNumber();
  const sDate = rentalAgreementAccount.startDate.toNumber();
  const eDate = rentalAgreementAccount.endDate.toNumber();
  const securityDeposit = rentalAgreementAccount.securityDeposit;
  const { amount, initiatedDate, paidDate, paymentStatus, status } =
    securityDeposit;
  const paymentHistory =
    rentalAgreementAccount.paymentHistory as anchor.IdlTypes<TrustRent>["Payment"][];
  paymentHistory.forEach((payment) => {
    const { paymentId, amount, date } = payment;
  });

  const updateDB = await db.insert(rentalAgreements).values({
    landlord: landlord,
    tenant: tenant,
    paymentCollectionAccount: paymentCollectionAccount,
    rentAmount: rent,
    startDate: sDate,
    endDate: eDate,
    securityDepositAmount: amount.toNumber(),
    securityDepositInitiatedDate: initiatedDate.toNumber(),
    securityDepositPaidDate: paidDate.toNumber(),
    // securityDepositPaymentStatus: paymentStatus,
    // securityDepositEscrowStatus: status,
  });
};
