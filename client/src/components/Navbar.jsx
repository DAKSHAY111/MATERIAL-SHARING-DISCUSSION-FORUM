import React from 'react';
import IconButton from "@mui/material/IconButton";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import '../style/Navbar.css';

const Navbar = () => {
  return (
    <div className='navbar-outer'>
        {/* <IconButton>
            <MenuRoundedIcon />
        </IconButton> */}
        <div className="navbar"></div>
    </div>
  )
}

export default Navbar;