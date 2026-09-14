import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "TaskNow - On-Demand Local Services",
  description:
    "Connect with vetted local professionals for home repairs, cleaning, tutoring, beauty services and more. Book instantly, track in real-time.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0F172A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-50 antialiased">
        <AuthProvider>
          <div className="mx-auto min-h-screen max-w-screen-xl">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}