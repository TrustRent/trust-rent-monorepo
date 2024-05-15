import idl from "~/target/idl/trust_rent.json";
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
  return new anchor.Program(idl as anchor.Idl, programID, provider);
};
