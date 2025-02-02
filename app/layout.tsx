import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chat App",
    description: "Created by Pouria Darandi",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

function RootLayout({ children }: Readonly<RootLayoutProps>) {
    return (
        <html lang="en">
            <body className={`antialiased`}>{children}</body>
        </html>
    );
}

export default RootLayout;
