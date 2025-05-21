import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, InputAdornment } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import useUserStore from '../store/userStore';
import authService from '../services/authService';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import AuthRegisterForm from '../components/AuthRegisterForm';

const Register: React.FC = () => {
  return <AuthRegisterForm />;
};

export default Register; 