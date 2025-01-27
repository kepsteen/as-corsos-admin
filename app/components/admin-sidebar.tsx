"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { DogIcon as Puppy, ClipboardList, MessageCircle } from "lucide-react"
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
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Puppies", icon: Puppy, href: "/admin/puppies" },
  { title: "Waitlist", icon: ClipboardList, href: "/admin/waitlist" },
  { title: "Testimonials", icon: MessageCircle, href: "/admin/testimonials" },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="h-screen" collapsible="none">
      <SidebarHeader>
        <h2 className="px-6 text-lg font-semibold">Admin Panel</h2>
      </SidebarHeader>
      <SidebarContent>
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
    </Sidebar>
  )
}

