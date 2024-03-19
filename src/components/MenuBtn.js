import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/GlowBtnMenu.css';

export function MenuBtn() {
    return (
        <div>
            <Link to='/menu'>
                <button type="button" className='glow-on-hover-menu'>Our Full Menu</button>
            </Link>
        </div>
    )
}