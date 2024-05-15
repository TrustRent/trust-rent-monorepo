import * as anchor from "@project-serum/anchor";
import {
  type BlockheightBasedTransactionConfirmationStrategy,
  PublicKey,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { getProgram, getProvider } from "~/components/web3Components/program";
import { RentalAgreement } from "~/types/ContractTypes";
export const createRentalAgreement = async (
  wallet: anchor.Wallet,
  tenantWallet: PublicKey,
  rentAmount: number,
  sdAmount: number,
  startDate: number,
  endDate: number,
) => {
  const provider = getProvider(wallet);
  const program = getProgram(provider);

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
  const mintPubkey = new PublicKey(
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  );

  const collectionAccountAddress: PublicKey = await getAssociatedTokenAddress(
    mintPubkey,
    pdaPubkey,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  // Agreement terms
  const rentBN: anchor.BN = new anchor.BN(rentAmount);
  const sdBN: anchor.BN = new anchor.BN(sdAmount);
  const startBN: anchor.BN = new anchor.BN(startDate);
  const endBN: anchor.BN = new anchor.BN(endDate);

  try {
    if (!program.methods.createRentAgreement) {
      return { message: "Method createRentAgreement not found" };
    }
    const latestBlockHash = await provider.connection.getLatestBlockhash();

    const tx = await program.methods
      .createRentAgreement(rentBN, sdBN, startBN, endBN)
      .accounts({
        rentalAgreement: pdaPubkey,
        collectionAccount: collectionAccountAddress,
        landlord: wallet.publicKey,
        usdcMint: mintPubkey,
        tenant: tenantWallet,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([wallet.payer])
      .rpc();

    // New transaction confirmation strategy
    const confirmStrategy: BlockheightBasedTransactionConfirmationStrategy = {
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: tx,
    };

    await provider.connection.confirmTransaction(confirmStrategy, "processed");
  } catch (e) {
    return { message: "Error creating rental agreement" };
  }
  try {
    if (!program.account.rentalAgreement) return;
    const rentalAgreementAccount =
      await program.account.rentalAgreement?.fetch(pdaPubkey);

    if (
      !rentalAgreementAccount.rentAmount ||
      !rentalAgreementAccount.paymentHistory
    )
      return;
    const rentalAgreementData: RentalAgreement = await Promise.all([
      rentalAgreementAccount.paymentHistory as RentalAgreement["paymentHistory"],
      rentalAgreementAccount.rentAmount as number,
    ]);
  } catch (e) {
    return { message: "Cannot not find accounts" };
  }
};
