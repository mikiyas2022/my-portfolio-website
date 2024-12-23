import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  if (!token) {
    return <Outlet />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 