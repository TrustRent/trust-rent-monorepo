import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TrustRent } from "../target/types/trust_rent";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { assert } from "chai";
import "@solana/web3.js";

describe("trust-rent", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const program = anchor.workspace.TrustRent as Program<TrustRent>;
  const landlordPrivateKey = new Uint8Array([
    111, 30, 41, 32, 197, 150, 25, 96, 242, 2, 217, 250, 225, 255, 139, 2, 250,
    240, 90, 64, 61, 111, 92, 23, 163, 17, 173, 171, 194, 208, 91, 7, 151, 27,
    85, 222, 206, 145, 197, 197, 118, 164, 20, 113, 106, 7, 165, 156, 157, 138,
    43, 246, 82, 161, 166, 133, 80, 250, 238, 30, 181, 15, 170, 93,
  ]);
  const tenantPrivateKey = new Uint8Array([
    76, 133, 28, 75, 163, 199, 48, 246, 83, 159, 71, 110, 4, 237, 33, 214, 187,
    3, 220, 176, 40, 135, 217, 69, 151, 95, 182, 128, 234, 190, 175, 132, 13,
    58, 225, 93, 222, 194, 108, 169, 135, 199, 30, 182, 108, 223, 54, 227, 242,
    254, 196, 192, 194, 125, 129, 169, 186, 48, 16, 214, 155, 148, 0, 38,
  ]);
  const tenantKeypair = Keypair.fromSecretKey(tenantPrivateKey);
  const landlordKeypair = Keypair.fromSecretKey(landlordPrivateKey);
  const landlordPublicKey = landlordKeypair.publicKey;
  console.log(`landlord: ${landlordPublicKey.toString()}`);
  const tenantPubkey = new PublicKey(
    "teNhcNH7wbRehkUoC8xM3sUgeckgqEB1phCiAv3VQGd"
  );
  console.log(`tenant: ${tenantPubkey.toString()}`);
  const mintPubkey = new PublicKey(
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  );

  const seeds = [
    Buffer.from("rental_agreement"),
    landlordPublicKey.toBuffer(),
    tenantPubkey.toBuffer(),
  ];
  const [pdaPubkey, bumps] = PublicKey.findProgramAddressSync(
    seeds,
    program.programId
  );
  const rentAmount = new anchor.BN(2400);
  it("should create rental agreement", async () => {
    const landlordairdroptx = await provider.connection.requestAirdrop(
      landlordPublicKey,
      5 * LAMPORTS_PER_SOL
    );

    await provider.connection.confirmTransaction(
      landlordairdroptx,
      "processed"
    );
    const balance = await provider.connection.getBalance(landlordPublicKey);
    console.log(`New balance: ${balance}`);
    console.log(`pda: ${pdaPubkey.toString()}`);
    const collectionAccountAddress = await getAssociatedTokenAddress(
      mintPubkey,
      pdaPubkey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    console.log(`collection account: ${collectionAccountAddress.toString()}`);
    const startDate = new anchor.BN(
      Math.floor(new Date("2023-09-01").getTime() / 1000)
    );
    const endDate = new anchor.BN(
      Math.floor(new Date("2023-09-30").getTime() / 1000)
    );

    console.log("Creating rent agreement");
    try {
      const tx = await program.methods
        .createRentAgreement(rentAmount, startDate, endDate)
        .accounts({
          rentalAgreement: pdaPubkey,
          collectionAccount: collectionAccountAddress,
          landlord: landlordPublicKey,
          usdcMint: mintPubkey,
          tenant: tenantPubkey,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([landlordKeypair])
        .rpc();
      console.log(JSON.stringify(tx));
      await provider.connection.confirmTransaction(tx, "processed");
    } catch (e) {
      console.error(e);
    }
    console.log("Transaction confirmed.");
    const rentalAgreementAccount =
      await program.account.rentalAgreement.fetch(pdaPubkey);
    console.log(rentalAgreementAccount);

    rentalAgreementAccount.paymentHistory.forEach((payment: any) => {
      assert.equal(payment.amount.toNumber(), 0);
      assert.equal(payment.date.toNumber(), 0);
    });
    assert.isTrue(rentalAgreementAccount.landlord.equals(landlordPublicKey));
    assert.isTrue(rentalAgreementAccount.tenant.equals(tenantPubkey));
    assert.equal(
      rentalAgreementAccount.rentAmount.toNumber(),
      rentAmount.toNumber()
    );
    assert.equal(
      rentalAgreementAccount.startDate.toNumber(),
      startDate.toNumber()
    );
    assert.equal(rentalAgreementAccount.endDate.toNumber(), endDate.toNumber());
    assert.isTrue(
      rentalAgreementAccount.paymentCollectionAccount.equals(
        collectionAccountAddress
      )
    );
    assert.equal(rentalAgreementAccount.paymentHistory.length, 12);
  });
  it("should pay rent", async () => {
    const tenantairdroptx = await provider.connection.requestAirdrop(
      tenantPubkey,
      5 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(tenantairdroptx, "processed");
    const collectionAccountAddress = await getAssociatedTokenAddress(
      mintPubkey,
      pdaPubkey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    const tenantUsdc = await getAssociatedTokenAddress(
      mintPubkey,
      tenantPubkey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    console.log("Creating payment tx");
    try {
      const tx = await program.methods
        .payRent(rentAmount)
        .accounts({
          rentalAgreement: pdaPubkey,
          landlord: landlordPublicKey,
          usdcMint: mintPubkey,
          tenant: tenantPubkey,
          tenantUsdc: tenantUsdc,
          paymentCollectionAccount: collectionAccountAddress,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([tenantKeypair])
        .rpc();
      console.log(JSON.stringify(tx));
      await provider.connection.confirmTransaction(tx, "processed");
    } catch (e) {
      console.error(e);
    }
  });
});
