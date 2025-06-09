import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import UsrProfile from './components/app-user'
import {SiteHeader} from './components/app-siteHeader'

function App() {
  return (
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
          
        </SidebarInset>

      </SidebarProvider>

    
    </div>
  )
}

export default App
