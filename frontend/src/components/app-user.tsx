import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, LogIn, UserPlus } from "lucide-react"
import { useEffect, useState } from "react"

export default function UsrProfile(){
    // State for login status
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // useEffect to handle login status changes
    useEffect(() => {
        // Check if user is logged in (replace with your actual auth logic)
        const checkLoginStatus = () => {
            // Example: check localStorage, cookies, or auth context
            const token = localStorage.getItem('authToken')
            const userData = localStorage.getItem('userData')
            
            if (token && userData) {
                setIsLoggedIn(true)
            } else {
                setIsLoggedIn(false)
            }
        }

        // Check on component mount
        checkLoginStatus()

        // Listen for storage changes (if using localStorage)
        const handleStorageChange = () => {
            checkLoginStatus()
        }

        window.addEventListener('storage', handleStorageChange)

        // Cleanup
        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [])

    // Function to handle login/logout (for testing)
    const handleLoginToggle = () => {
        if (isLoggedIn) {
            // Logout
            localStorage.removeItem('authToken')
            localStorage.removeItem('userData')
            setIsLoggedIn(false)
        } else {
            // Login
            localStorage.setItem('authToken', 'fake-token')
            localStorage.setItem('userData', JSON.stringify({ name: 'Test User', email: 'test@example.com' }))
            setIsLoggedIn(true)
        }
    }

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="p-2 rounded-full hover:bg-muted cursor-pointer transition-all duration-300 ease-in-out">
                    <Avatar>
                        {isLoggedIn ? (
                            <AvatarImage src="https://github.com/shadcn.png" />
                        ) : (
                            <AvatarFallback>
                                <User className="h-4 w-4" />
                            </AvatarFallback>
                        )}
                        
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className="w-56" 
                align="end" 
            >
                {isLoggedIn ? (
                    // Logged in user dropdown
                    <>
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">User Name</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    user@example.com
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
                        <DropdownMenuItem onClick={handleLoginToggle}>
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
                        <DropdownMenuItem onClick={handleLoginToggle}>
                            <LogIn className="mr-2 h-4 w-4" />
                            <span>Log in</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>Sign up</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}