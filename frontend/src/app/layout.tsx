import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import React from "react";
import { Wallet } from "~/components/web3Components/WalletContextProvider";
import Sidebar from "~/components/sidebar";
import Header from "~/components/header";

export const metadata = {
  title: "Trust Rent",
  description: "The next generation of landlord financial dashboards",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Wallet>
          <Sidebar />
          <Header />
          {children}
        </Wallet>
      </body>
    </html>
  );
}
