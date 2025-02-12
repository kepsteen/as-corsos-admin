import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./components/admin-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Admin Panel",
	description: "Admin panel for managing puppies, waitlist, and testimonials",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<SidebarProvider className="w-screen">
					<div className="min-h-screen grid grid-cols-[11rem_1fr] w-full">
						<AdminSidebar />
						<main className="flex-1 p-8 justify-center transition-all duration-300 w-full">
							{children}
						</main>
					</div>
				</SidebarProvider>
				<Toaster />
				<SonnerToaster />
			</body>
		</html>
	);
}
