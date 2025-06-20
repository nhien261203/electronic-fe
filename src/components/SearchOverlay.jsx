import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SearchOverlay = ({ onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 md:pt-5 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white w-[90%] max-w-md md:max-w-lg md:p-[9px] p-[7px] rounded shadow-lg"
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <input
                        type="text"
                        autoFocus
                        placeholder="Bạn cần tìm kiếm gì ..."
                        className="w-full md:text-md text-sm border-gray-300 focus:outline-none"
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SearchOverlay;
