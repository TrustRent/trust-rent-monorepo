import React from "react";
import Link from "next/link.js";
import UserItem from "./useritem";
import { WalletMultiButton } from "./web3Components/multiWalletButton";

export default function Header() {
  return (
    <div className="bg-jetBlack fixed flex h-[100px] w-full items-center justify-between pl-[200px]">
      <input
        type="search"
        placeholder="Search..."
        className="hidden md:block "
      />
      <div className="hidden md:block ">
        <WalletMultiButton />
      </div>
      <div>
        <Link href="/settings">
          <i className="settings-icon">⚙️</i>
        </Link>
        <div></div>
      </div>
    </div>
  );
}
