"use client";
import { useState } from "react";
import { WalletDropdown } from "./walletDropdown";
import { WalletDialog } from "./walletDialog";
import { CardHeader, CardTitle } from "../ui/card";

export const WalletCard: React.FC = () => {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const walletOptions: string[] = [
    "Bitcoin",
    "Solana",
    "Ethereum",
    "Optimum",
    "Base",
    "BNB",
    "Polygon",
  ];

  const handleDialogOpen = (walletType: string) => setActiveDialog(walletType);
  const handleDialogClose = () => setActiveDialog(null);
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    walletType: string,
  ) => {
    event.preventDefault();
    const address = (
      event.currentTarget.elements.namedItem("btcAddress") as HTMLInputElement
    ).value;
    console.log(`Submitting ${walletType} form`);
    console.log(`Address: ${address}`);
    handleDialogClose();
  };

  return (
    <CardHeader>
      <div className="flex justify-between">
        <CardTitle>Your Wallets</CardTitle>
        <WalletDropdown
          onWalletSelect={handleDialogOpen}
          walletOptions={walletOptions}
        />
        {walletOptions.map((wallet) => (
          <WalletDialog
            key={wallet}
            walletType={wallet}
            isOpen={activeDialog === wallet}
            onClose={handleDialogClose}
            onSubmit={handleSubmit}
          />
        ))}
      </div>
    </CardHeader>
  );
};
