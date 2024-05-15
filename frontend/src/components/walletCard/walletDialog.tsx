import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface WalletDialogProps {
  walletType: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    walletType: string,
  ) => void;
}

export const WalletDialog: React.FC<WalletDialogProps> = ({
  walletType,
  isOpen,
  onClose,
  onSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader> Input {walletType} Wallet Address</DialogHeader>
        <form onSubmit={(e) => onSubmit(e, walletType)}>
          <div className="grid grid-cols-6 grid-rows-1 items-center gap-4 pr-4">
            <Label htmlFor="btc Address" className="text-right">
              Address
            </Label>
            <Input id="btcAddress" name="btcAddress" className="col-span-5" />
          </div>
          <div className="p-2">
            <DialogFooter>
              <Button type="submit" className="p-4">
                Submit
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
