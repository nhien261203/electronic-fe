// src/components/skeletons/TableSkeleton.jsx
import React from 'react'

const TableSkeleton = ({ columns = 5, rows = 6 }) => {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIdx) => (
                <tr key={rowIdx} className="animate-pulse border-t">
                    {Array.from({ length: columns }).map((_, colIdx) => (
                        <td key={colIdx} className="p-3">
                            <div className="h-4 w-full max-w-[80%] bg-gray-200 rounded" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    )
}

export default TableSkeleton
