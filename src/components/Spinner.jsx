import React from 'react'
import PropTypes from 'prop-types'

const Spinner = ({ size = 40, color = 'blue', className = '' }) => {
    const borderColor = {
        blue: 'border-blue-500',
        white: 'border-white',
        gray: 'border-gray-400',
        green: 'border-green-500',
        red: 'border-red-500'
    }

    const borderClass = borderColor[color] || 'border-blue-500'

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`animate-spin rounded-full border-4 border-t-transparent ${borderClass}`}
                style={{
                    width: `${size}px`,
                    height: `${size}px`
                }}
            />
        </div>
    )
}

Spinner.propTypes = {
    size: PropTypes.number,
    color: PropTypes.oneOf(['blue', 'white', 'gray', 'green', 'red']),
    className: PropTypes.string
}

export default Spinner
