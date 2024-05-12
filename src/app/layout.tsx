import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

export const metadata = {
  title: "Trust Rent",
  description:
    "TrustRent is a cutting-edge web application designed for the Solana network, leveraging the speed and transparency of blockchain to transform the rental market. Our platform is built with the aim of optimizing rent payments and security deposit management, ensuring instant transactions, yielding financial benefits, and fostering trust between tenants and landlords.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
