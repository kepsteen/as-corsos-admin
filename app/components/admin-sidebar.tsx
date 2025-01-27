"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	DogIcon as Puppy,
	ClipboardList,
	MessageCircle,
	LogOut,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/utils/client";
import { useRouter } from "next/navigation";

const navItems = [
	{ title: "Puppies", icon: Puppy, href: "/admin/puppies" },
	{ title: "Waitlist", icon: ClipboardList, href: "/admin/waitlist" },
	{ title: "Testimonials", icon: MessageCircle, href: "/admin/testimonials" },
];

export function AdminSidebar() {
	const pathname = usePathname();
	const router = useRouter();

	const handleSignOut = async () => {
		const supabase = createClient();
		try {
			await supabase.auth.signOut();
			router.push("/login");
		} catch (error) {}
	};

	return (
		<Sidebar className="h-screen flex flex-col" collapsible="none">
			<SidebarHeader>
				<h2 className="px-6 text-lg font-semibold">Admin Panel</h2>
			</SidebarHeader>
			<SidebarContent className="flex-1">
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild isActive={pathname === item.href}>
										<Link href={item.href} className="flex items-center gap-3">
											<item.icon className="h-4 w-4" />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<div className="p-4 border-t">
				<button
					onClick={handleSignOut}
					className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
				>
					<LogOut className="h-4 w-4" />
					<span>Sign Out</span>
				</button>
			</div>
		</Sidebar>
	);
}
