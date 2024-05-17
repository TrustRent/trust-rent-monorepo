import idl from "/Users/brandonrobb/Github_Projects/trust-rent-monorepo/backend/target/idl/trust_rent.json";
import { TrustRent } from "/Users/brandonrobb/Github_Projects/trust-rent-monorepo/backend/target/types/trust_rent";
import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

const programID = new PublicKey(idl.metadata.address);
const connection = new Connection("https://api.devnet.solana.com", "processed");

export const getProvider = (wallet: anchor.Wallet) => {
  return new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions(),
  );
};

export const getProgram = (provider: anchor.AnchorProvider) => {
  return new anchor.Program(idl as unknown as TrustRent, programID, provider);
};
