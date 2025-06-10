import React from "react";
import { useAuth } from "../context/AuthContext";
import Memo from "./ui/memo";


export default function ToDo(){
    const { isLoggedIn, userData } = useAuth();


    return(
       <div className="container py-3 px-3">
            
            {isLoggedIn ? (
                <div className="">
            
                </div>
            ) : (
                <h1>Please log in to see your tasks.</h1>
            )}


       </div>
    )
}