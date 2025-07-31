import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";
import { ClientOnly } from "@/components/client-only";

export const metadata: Metadata = {
  title: "Web App",
  description: "Description here.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <TRPCReactProvider>
        <html lang="en">
          <body
            className={`${geist.variable} dark min-h-dvh bg-radial from-orange-950 to-neutral-950 antialiased`}
          >
            <header className="bg-card flex h-16 items-center justify-end gap-4 p-4">
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            {children}
            <ClientOnly>
              <Toaster />
            </ClientOnly>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
