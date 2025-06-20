import React, { useEffect, useState } from 'react'
import Header from '../pages/admin/Header'
import { Outlet } from 'react-router-dom'
import SideBar from '../pages/admin/SideBar'
import Footer from '../pages/admin/Footer'


const AdminLayout = () => {
     const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [collapsed, setCollapsed] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setCollapsed(true);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleToggleSidebar = () => {
        setCollapsed(prev => !prev);
    };

    return (
        <>
            <div className="h-screen flex flex-col bg-gray-100 overflow-hidden ">
                <Header onToggleSidebar={handleToggleSidebar} />
                {/* Phần còn lại cuộn cùng nhau */}
                <div className="flex flex-1 overflow-hidden ">
                    <SideBar collapsed={collapsed} isMobile={isMobile} />

                    {/* Overlay mobile */}
                    {isMobile && !collapsed && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                            onClick={() => setCollapsed(true)}
                        />
                    )}

                    {/* Main content cuộn cùng sidebar */}
                    <div className="flex-1 overflow-auto p-4 pt-20 scrollbar-hide">
                        <Outlet />
                    </div>

                </div>
            </div>
            <Footer />

        </>
    )
}

export default AdminLayout