import { SidebarTrigger } from "@/components/ui/sidebar"
import UsrProfile from "./app-user"
import {NavLink} from "react-router-dom"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import { useIsMobile } from "@/hooks/use-mobile"


export function SiteHeader() {
  const isMobile = useIsMobile();

  return (
    <header className="pb-1 w-full group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className=" flex justify-between w-full items-center gap-1 px-1 lg:gap-2 lg:px-2">
        

        <div className="flex">
            {isMobile ? <SidebarTrigger className="transition-all duration-300 ease-in-out -ml-1" /> : undefined}

            <div className="pl-2 py-1">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                isActive ? "text-black font-medium" : "text-muted-foreground hover:text-foreground"
                            }
                        >
                            Home
                        </NavLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <NavLink 
                            to="/about" 
                            className={({ isActive }) => 
                                isActive ? "text-black font-medium" : "text-muted-foreground hover:text-foreground"
                            }
                        >
                            About
                        </NavLink>
                        </BreadcrumbItem>

                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            
        </div>   
        <div className="lg:px-4">
            <UsrProfile />
        </div>
    
      </div>

    </header>
  )
}
