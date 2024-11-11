import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@mui/material";
import { PrimaryTheme } from "@/Theme";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "NSC PLATFORM",
  description:
    "Explore your creativity with fun coding projects in Blockly and Scratch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: "0px" }}>
        <ThemeProvider theme={PrimaryTheme}>
          <main>
            <Toaster richColors position="top-right" />
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
