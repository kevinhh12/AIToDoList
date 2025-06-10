import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { BrowserRouter, Routes, Route } from "react-router-dom";
import UsrProfile from './components/app-user'
import {SiteHeader} from './components/app-siteHeader'
import Layout from "./Layout";
import About from './components/app-about'
import ToDo from './components/app-todo'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}> 
          <Route path="/" element = {<ToDo />}/>
          <Route path="/about" element = {<About />} />
        </Route>

        
      </Routes>
    
    </BrowserRouter>
    
  )
}

export default App
