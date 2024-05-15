import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { plusCircle } from "../icons";

interface WalletDropdownProps {
  onWalletSelect: (wallet: string) => void;
  walletOptions: string[];
}

export const WalletDropdown: React.FC<WalletDropdownProps> = ({
  onWalletSelect,
  walletOptions,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-softSilver">
        {plusCircle}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-charcoalDust">
        {walletOptions.map((wallet) => (
          <DropdownMenuItem
            key={wallet}
            className="text-softSilver cursor-pointer"
            onClick={() => onWalletSelect(wallet)}
          >
            {wallet}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
