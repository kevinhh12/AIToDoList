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
import axios from 'axios';

interface UserData {
    id: string
    name: string
    email: string
    picture: string
}

export default function UsrProfile(){
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState<UserData | null>(null)

    // Check login status on mount
    useEffect(() => {
        checkLoginStatus()
    }, [])

    const checkLoginStatus = async () => {
        try {
            // Check if user is authenticated with your backend
            const response = await axios.get('http://localhost:3000/login/auth/status', {
                withCredentials: true // Include cookies
            })
            
            if (response.status === 200) {
                const user = response.data
                console.log(user) // testing
                setUserData(user)
                setIsLoggedIn(true)
            } else {
                setIsLoggedIn(false)
                setUserData(null)
            }
        } catch (error) {
            console.error('Error checking auth status:', error)
            setIsLoggedIn(false)
            setUserData(null)
        }
    }

    const handleGoogleLogin = () => {
        // Redirect to your backend's Google OAuth endpoint
        window.location.href = 'http://localhost:3000/login/auth/google'
    }

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3000/login/auth/logout',
                {}, // empty body
                { withCredentials: true } // this is the config
              );
            
            if (response.status === 200) {
                console.log('Logout successful on client side. Updating state...');
                setIsLoggedIn(false)
                setUserData(null)
                checkLoginStatus() // Re-check status after logout
            }
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }


    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="p-2 rounded-full hover:bg-muted cursor-pointer transition-all duration-300 ease-in-out">
                    <Avatar className="h-8 w-8">
                        {isLoggedIn && userData ? (
                            
                            <AvatarImage src={userData.picture} alt={userData.name} />
                        ) : (
                            <div className="flex items-center justify-center h-full w-full">
                                <User/>
                            </div>
                        )}
                    </Avatar>
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