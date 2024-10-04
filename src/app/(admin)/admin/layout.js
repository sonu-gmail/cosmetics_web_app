"use client"
import { useState } from "react";
import Sidebar from "../../../components/layout/sidebar";
import Header from "../../../components/layout/header";
import { SessionProvider } from 'next-auth/react';

const AdminDashboardLayout = ({children}) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleSidebar = (value) => {
        setIsSidebarOpen(value);
    }

    return (
        <SessionProvider>
            <div className="font-sans text-gray-900 antialiased">
                <div className="min-h-screen flex">
                    <Sidebar isOpenSidebar={isSidebarOpen}/>
                    <div className="flex-grow flex flex-col">
                        <Header sidebar={handleSidebar} isOpenSidebar={isSidebarOpen}/>
                        <div className="flex-grow flex flex-col py-12 px-12">
                            <div className="flex-grow">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SessionProvider>
    )
}

export default AdminDashboardLayout;