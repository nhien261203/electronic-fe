
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#e5e7eb] text-gray-500 text-md text-center py-4 border-t ">
            © {new Date().getFullYear()} Nexus Admin Panel. All rights reserved.
        </footer>
    );
};

export default Footer;
