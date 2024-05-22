import React from "react";
import Link from "next/link.js";
import { WalletMultiButton } from "./web3Components/multiWalletButton";

export default function Header() {
  return (
    <div className="z-5 fixed left-0 right-0 top-0 h-[100px] bg-[#080A15] pl-[200px]">
      <div className="container mx-auto flex h-full items-center ">
        <input
          type="search"
          placeholder="Search..."
          className="ml-auto hidden justify-end md:block"
        />
        <div className="ml-auto hidden items-center  space-x-[20px] md:flex">
          <WalletMultiButton />
          <Link href="/settings">
            <i className="settings-icon">⚙️</i>
          </Link>
        </div>
      </div>
    </div>
  );
}
