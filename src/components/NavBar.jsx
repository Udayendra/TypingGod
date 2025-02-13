import React from 'react';
import DarkModeToggle from './DarkModeToggle';

const NavBar = () => {
    return (
        <nav className="p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-textcolor text-3xl font-bold traking-wider">TypingGod</div>
                <div> <DarkModeToggle/> </div>
            </div>
        </nav>
    );
};

export default NavBar;