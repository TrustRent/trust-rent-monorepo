import idl from "~/target/idl/trust_rent.json";
import * as anchor from "@project-serum/anchor";
import { web3 } from "@project-serum/anchor";
import { readFileSync } from "fs";

function loadWalletKey(keypairFile: string): anchor.web3.Keypair {
  const fileContent = readFileSync(keypairFile, { encoding: "utf-8" });
  const secretKey = JSON.parse(fileContent) as number[];
  const secretKeyUint8Array = new Uint8Array(secretKey);
  const kp: web3.Keypair = web3.Keypair.fromSecretKey(secretKeyUint8Array);

  return kp;
}

function loadWallet(keypairFile: string): anchor.Wallet {
  const kp = loadWalletKey(keypairFile);
  const wallet = new anchor.Wallet(kp);

  return wallet;
}

const connection = new anchor.web3.Connection("Http://localhost:8899");
const provider = new anchor.AnchorProvider(
  connection,
  loadWallet(
    "/Users/brandonrobb/Github_Projects/trust-rent-frontend/C1APCbeHi5ND3nDPQXR9R15bWyDYjLK8dZh2T3aebLSB.json",
  ),
  anchor.AnchorProvider.defaultOptions(),
);

const programId = new anchor.web3.PublicKey(idl.metadata.address);

export const program = new anchor.Program(
  idl as anchor.Idl,
  programId,
  provider,
);
