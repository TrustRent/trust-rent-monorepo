// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  index,
  integer,
  pgEnum,
  pgTableCreator,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const SecurityDepositPaidStatusEnum = pgEnum(
  "security_deposit_paid_status",
  ["Unpaid", "Paid"],
);
export const SecurityDepositEscrowStatusEnum = pgEnum(
  "security_deposit_escrow_status",
  ["Unfunded", "Escrowed", "Returned", "Claimed", "Staked"],
);
export const createTable = pgTableCreator((name) => `trust-rent_${name}`);

export const rentalAgreements = createTable(
  "RentalAgreement",
  {
    id: serial("id").primaryKey(),
    landlord: varchar("landlord", { length: 256 }),
    tenant: varchar("tenant", { length: 256 }),
    paymentCollectionAccount: varchar("paymentCollectionAccount", {
      length: 256,
    }),
    rentAmount: integer("rentAmount"),
    startDate: integer("startDate"),
    endDate: integer("endDate"),
    securityDepositAmount: integer("securityDepositAmount"),
    securityDepositInitiatedDate: integer("securityDepositInitiatedDate"),
    securityDepositPaidDate: integer("securityDepositPaidDate"),
    securityDepositPaymentStatus: SecurityDepositPaidStatusEnum(
      "security_deposit_paid_status",
    ),
    securityDepositEscrowStatus: SecurityDepositEscrowStatusEnum(
      "security_deposit_escrow_status",
    ),
  },
  (rentalAgreements) => ({
    landlordIndex: index("idx_rental_agreements_landlord").on(
      rentalAgreements.landlord,
    ),
    tenantIndex: index("idx_rental_agreements_tenant").on(
      rentalAgreements.tenant,
    ),
  }),
);

export const paymentHistory = createTable(
  "PaymentHistory",
  {
    id: serial("id").primaryKey(),
    rentalAgreementId: integer("rentalAgreementId").references(
      () => rentalAgreements.id,
    ),
    amount: integer("amount"),
    date: integer("date"),
  },
  (paymentHistory) => ({
    rentalAgreementIdIndex: index("idx_payment_history_rental_agreement_id").on(
      paymentHistory.rentalAgreementId,
    ),
    paymentIdIndex: index("idx_payment_history_payment_id").on(
      paymentHistory.id,
    ),
  }),
);
