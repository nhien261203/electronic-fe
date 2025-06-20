
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white text-gray-500 text-sm text-center py-4 border-t ">
            © {new Date().getFullYear()} Nexus Admin Panel. All rights reserved.
        </footer>
    );
};

export default Footer;
