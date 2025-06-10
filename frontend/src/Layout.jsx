import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,

} from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
import {SiteHeader} from './components/app-siteHeader'


export default function Layout(){
    return(
        <div className="flex min-h-screen">
        <SidebarProvider
          style={{ 
            "--sidebar-width": "24rem", // 384px - equivalent to w-96 It adjusted the sidebar size
            "--sidebar-width-icon": "4rem", // 64px
          }}
        >
          <AppSidebar />
          
          <SidebarInset>
            <div className="flex justify-between items-center p-1">
              <SiteHeader/>

              
            </div>

            <div>
              <Outlet />
            </div>
            
          </SidebarInset>

        </SidebarProvider>

    
    </div>
    )
}