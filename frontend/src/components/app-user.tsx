
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, LogIn} from "lucide-react"
import { useAuth } from '../context/AuthContext'

export interface UserData {
    id: string
    name: string
    email: string
    picture: string
}

export default function UsrProfile(){
    const { isLoggedIn, userData, handleLogout, handleGoogleLogin } = useAuth()
    if (userData) {
        console.log(userData.picture)
    }

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="p-2 rounded-full hover:bg-muted cursor-pointer transition-all duration-300 ease-in-out">
                    <div className=" h-8 w-8">
                        {isLoggedIn && userData ? (
                           
                                <img className="rounded-full" src={userData.picture} alt={userData.name} />
         
                            
                        ) : (
                            <div className="flex items-center justify-center h-full w-full">
                                <User/>
                            </div>
                        )}
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className="w-56" 
                align="end" 
            >
                {isLoggedIn && userData ? (
                    // Logged in user dropdown
                    <>
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{userData.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {userData.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </>
                ) : (
                    // Non-logged in user dropdown
                    <>
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Guest User</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    Not logged in
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleGoogleLogin}>
                            <LogIn className="mr-2 h-4 w-4" />
                            <span>Sign in with Google</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}