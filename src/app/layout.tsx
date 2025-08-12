"use client";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Toast container for react-hot-toast */}
        <Toaster
          position="top-center"
          toastOptions={{
            success: {
              duration: 3000,
              style: { background: "#4ade80", color: "#fff" }, // Optional styling
            },
            error: {
              duration: 5000,
              style: { background: "#f87171", color: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
