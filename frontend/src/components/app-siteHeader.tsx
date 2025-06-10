import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import UsrProfile from "./app-user"
import {Link} from "react-router-dom"


export function SiteHeader() {

  

  return (
    <header className="pb-1 w-full group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className=" flex justify-between w-full items-center gap-1 px-1 lg:gap-2 lg:px-2">
        

        <div className="flex">
            <SidebarTrigger className="transition-all duration-300 ease-in-out -ml-1" />
            <div className="py-1.5">
                <Separator orientation="vertical" className=" mx-2 data-[orientation=vertical]:h-4" />    
            </div>
            <div>
                <Link to={'/'}> Main </Link>
            </div>
            <div className="py-1.5">
                <Separator orientation="vertical" className=" mx-2 data-[orientation=vertical]:h-4" />    
            </div>
            <div>
                <Link to={'/about'}> About </Link>
            </div>
            
        </div>   
        
        <div className="lg:px-4">
            <UsrProfile />
        </div>
    
      </div>

    </header>
  )
}
