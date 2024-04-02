import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TrustRent } from "../target/types/trust_rent";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

describe("trust-rent", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const program = anchor.workspace.TrustRent as Program<TrustRent>;

  it("should run the program", async () => {
    const landlordPrivateKey = new Uint8Array([
      111, 30, 41, 32, 197, 150, 25, 96, 242, 2, 217, 250, 225, 255, 139, 2,
      250, 240, 90, 64, 61, 111, 92, 23, 163, 17, 173, 171, 194, 208, 91, 7,
      151, 27, 85, 222, 206, 145, 197, 197, 118, 164, 20, 113, 106, 7, 165, 156,
      157, 138, 43, 246, 82, 161, 166, 133, 80, 250, 238, 30, 181, 15, 170, 93,
    ]);
    // const rentalAgreementKeypair = Keypair.generate();
    // const rentalAgreementPubkey = rentalAgreementKeypair.publicKey;
    // console.log(`rentalAgreement: ${rentalAgreementPubkey.toString()}`);
    const landlordKeypair = Keypair.fromSecretKey(landlordPrivateKey);
    const landlordPublicKey = landlordKeypair.publicKey;
    console.log(`landlord: ${landlordPublicKey.toString()}`);
    const tenantPubkey = new PublicKey(
      "teNhcNH7wbRehkUoC8xM3sUgeckgqEB1phCiAv3VQGd"
    );
    console.log(`tenant: ${tenantPubkey.toString()}`);
    const mintPubkey = new PublicKey(
      "usdc4mXczxKeK2S1XC3FBKGLM97nQD4D3uHcDPh2s45"
    );
    const signatureLandlord = await provider.connection.requestAirdrop(
      landlordPublicKey,
      5 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(
      signatureLandlord,
      "processed"
    );
    const seeds = [
      Buffer.from("rental_agreement"),
      landlordPublicKey.toBuffer(),
      tenantPubkey.toBuffer(),
    ];
    const [pdaPubkey] = PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );
    console.log(`pda: ${pdaPubkey.toString()}`);
    const collectionAccountAddress = await getAssociatedTokenAddress(
      mintPubkey,
      pdaPubkey,
      true,
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID
    );

    console.log(`collection account: ${collectionAccountAddress.toString()}`);
    const security_deposit_amount = new anchor.BN(3600);
    const rentAmount = new anchor.BN(2400);
    const startDate = new anchor.BN(
      Math.floor(new Date("2023-09-01").getTime() / 1000)
    );
    const endDate = new anchor.BN(
      Math.floor(new Date("2023-09-30").getTime() / 1000)
    );
    try {
      console.log("Creating rent agreement");
      const tx = await program.methods
        .createRentAgreement(
          rentAmount,
          security_deposit_amount,
          startDate,
          endDate
        )
        .accounts({
          rentalAgreement: pdaPubkey,
          collectionAccount: collectionAccountAddress,
          landlord: landlordPublicKey,
          usdcMint: mintPubkey,
          tenant: tenantPubkey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([landlordKeypair])
        .rpc();
      await provider.connection.confirmTransaction(tx, "processed");
      console.log("Transaction confirmed.");
      const rentalAgreementAccount =
        await program.account.rentalAgreement.fetch(pdaPubkey);

      // expect(rentalAgreementAccount.landlord).toEqual(landlordPublicKey);
      // expect(rentalAgreementAccount.tenant).toEqual(tenantPubkey);
      // expect(rentalAgreementAccount.rentAmount).toEqual(rentAmount);
      // expect(rentalAgreementAccount.startDate).toEqual(startDate);
      // expect(rentalAgreementAccount.endDate).toEqual(endDate);
      // expect(rentalAgreementAccount.paymentCollectionAccount).toEqual(
      //   collectionAccountAddress
      // );
      // // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // rentalAgreementAccount.paymentHistory.forEach((payment: any) => {
      //   expect(payment.amount).toBe(0);
      //   expect(payment.date).toBe(0);
      // });
    } catch (e) {
      console.error(e);
    }
  });
});
