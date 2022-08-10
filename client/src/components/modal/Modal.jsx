import React from 'react'
import './modal.css';

export const Modal = ({ children }) => {
    return (
        <div className='modalWrapper'>
            <div className='modalOverlay'>

            </div>
            <div className="modalContent">
                
                {children}
            </div>

        </div>
    )
}
