"use client"
import { cn } from "@/lib/utils";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { WalletContextProvider } from "@/app/context/WalletProvider";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "./context/connectWallet";
require('@solana/wallet-adapter-react-ui/styles.css');
const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Quizmify",
//   description: "Quiz yourself on anything!",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen pt-16")}>
      <Wallet>
        <Providers>
        <WalletModalProvider>
          <Navbar />
          {children}
          <Toaster />
        </WalletModalProvider>
        </Providers>
        </Wallet>
      </body>
    </html>
  );
}
