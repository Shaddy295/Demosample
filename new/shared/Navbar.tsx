// src/components/Navbar.tsx
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import ListIcon from '@mui/icons-material/List';
import BriefcaseIcon from '@mui/icons-material/Work';
import Switch from '@mui/material/Switch';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import clsx from 'clsx'; // Import clsx for conditional class names
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../services/theme/ThemeContext';

const Navbar: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar
      position="static"
      className={clsx({
        'bg-green-800': !isDarkMode, // Light mode background color
        'bg-gray-900': isDarkMode, // Dark mode background color
      })}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="trending up" sx={{ mr: 1 }}>
          <TrendingUpIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          onClick={() => navigate('/')}
          className="cursor-pointer flex items-center text-white"
        >
          <span>Stock Market</span>
        </Typography>
        <div className="flex items-center">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            keepMounted
          >
            <MenuItem onClick={() => handleNavigation('/search')} className="flex items-center">
              <SearchIcon sx={{ mr: 1 }} />
              Search
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/watchlist')} className="flex items-center">
              <ListIcon sx={{ mr: 1 }} />
              Watchlist
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/portfolio')} className="flex items-center">
              <BriefcaseIcon sx={{ mr: 1 }} />
              Portfolio
            </MenuItem>
          </Menu>
          <div className="flex items-center">
            <Typography variant="body1" sx={{ mr: 1 }} className="text-white">
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </Typography>
            <Switch checked={isDarkMode} onChange={toggleTheme} />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
