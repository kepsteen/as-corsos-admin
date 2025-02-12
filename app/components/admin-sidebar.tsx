"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	DogIcon as Puppy,
	ClipboardList,
	MessageCircle,
	LogOut,
	PanelLeftClose,
	PanelLeft,
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
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
	{ title: "Puppies", icon: Puppy, href: "/admin/puppies" },
	{ title: "Waitlist", icon: ClipboardList, href: "/admin/waitlist" },
	{ title: "Testimonials", icon: MessageCircle, href: "/admin/testimonials" },
];

export function AdminSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const [isCollapsed, setIsCollapsed] = useState(false);

	const handleSignOut = async () => {
		const supabase = createClient();
		try {
			await supabase.auth.signOut();
			router.push("/login");
		} catch (error) {}
	};

	return (
		<Sidebar
			className={`h-screen flex flex-col fixed left-0 top-0 z-40 bg-white border-r transition-all duration-300 ${
				isCollapsed ? "w-16" : "w-48"
			}`}
		>
			<SidebarHeader className="flex items-center h-14 px-4 relative border-b">
				{!isCollapsed && (
					<h2 className="text-lg font-semibold truncate">Admin Panel</h2>
				)}
				<button
					className="absolute right-2 z-50"
					onClick={() => setIsCollapsed(!isCollapsed)}
				>
					{isCollapsed ? (
						<PanelLeft className="h-4 w-4" />
					) : (
						<PanelLeftClose className="h-4 w-4" />
					)}
				</button>
			</SidebarHeader>
			<SidebarContent className="flex-1">
				<SidebarGroup>
					{!isCollapsed && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild isActive={pathname === item.href}>
										<Link href={item.href} className="flex items-center gap-3">
											<item.icon className="h-4 w-4" />
											{!isCollapsed && <span>{item.title}</span>}
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
					{!isCollapsed && <span>Sign Out</span>}
				</button>
			</div>
		</Sidebar>
	);
}
