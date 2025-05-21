import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';

const AppHeader: React.FC = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <AppBar position="sticky" color="primary" elevation={2}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, fontWeight: 800, color: 'white', textDecoration: 'none', letterSpacing: 2 }}
        >
          QBox
        </Typography>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/create-survey" sx={{ fontWeight: 600, mr: 1 }}>
              Crear Encuesta
            </Button>
            <Button color="inherit" component={Link} to="/my-surveys" sx={{ fontWeight: 600, mr: 1 }}>
              Mis Encuestas
            </Button>
            <Box>
              <IconButton onClick={handleMenu} color="inherit">
                <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontWeight: 700 }}>
                  {user.name[0].toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem disabled>{user.name}</MenuItem>
                <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
              </Menu>
            </Box>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login" sx={{ fontWeight: 600, mr: 1 }}>
              Iniciar sesión
            </Button>
            <Button color="inherit" component={Link} to="/register" sx={{ fontWeight: 600 }}>
              Registrarse
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader; 