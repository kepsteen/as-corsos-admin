import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./components/admin-sidebar";
import { Toaster } from "@/components/ui/toaster";

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
				<SidebarProvider>
					<div className="flex h-screen w-full">
						<div className="w-64 flex-shrink-0 bg-sidebar">
							<AdminSidebar />
						</div>
						<main className="flex-1 max-h-screen overflow-y-auto p-8 w-full mx-auto">
							{children}
						</main>
					</div>
				</SidebarProvider>
				<Toaster />
			</body>
		</html>
	);
}
