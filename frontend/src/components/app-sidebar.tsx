import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

} from "@/components/ui/sidebar"

import { Card } from "./ui/card"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    
      <Sidebar className="h-full">
        <SidebarContent className="h-full">
          <SidebarGroup className="h-full">
            
            <SidebarGroupContent className="h-full flex-1">
              <Card className="h-full">

              </Card>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

  )
}