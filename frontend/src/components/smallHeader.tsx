import React from "react";
import Link from "next/link.js";
import { WalletMultiButton } from "./web3Components/multiWalletButton";
import { DropdownMenu } from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

export default function smallHeader() {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild></DropdownMenuTrigger>
      </DropdownMenu>
    </div>
  );
}
