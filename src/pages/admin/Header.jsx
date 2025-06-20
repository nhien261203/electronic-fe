import React, { useState, useRef, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import { IoMdSearch } from 'react-icons/io';
import SearchOverlay from '../../components/SearchOverlay';

const Header = ({ onToggleSidebar }) => {
    const [showSearch, setShowSearch] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef();

    // Đóng dropdown khi click ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <header className="fixed top-0 left-0 w-full h-16 bg-gray-200 text-slate-700 z-50 shadow px-4 flex items-center justify-between">
                {/* Nút toggle sidebar */}
                <button onClick={onToggleSidebar} className="hover:text-blue-500 transition">
                    <FiMenu size={22} />
                </button>

                {/* Tên hệ thống */}
                <h1 className="text-xl font-bold ">Nexus - Admin Panel</h1>

                {/* Tìm kiếm và Avatar */}
                <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
                    <IoMdSearch
                        className="text-2xl cursor-pointer hover:text-blue-500"
                        onClick={() => setShowSearch(true)}
                    />

                    <img
                        src="https://i.pravatar.cc/40"
                        alt="Avatar"
                        className="w-9 h-9 rounded-full cursor-pointer border"
                        onClick={() => setShowDropdown(!showDropdown)}
                    />

                    {/* Dropdown menu */}
                    {showDropdown && (
                        <div className="absolute right-0 top-12 bg-white border rounded-md shadow-md w-44 py-2 z-50">
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 text-sm">Hồ sơ</a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 text-sm">Cài đặt</a>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500">
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Tìm kiếm overlay */}
            {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
        </>
    );
};

export default Header;
