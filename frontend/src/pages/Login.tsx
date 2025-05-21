import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, InputAdornment } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import useUserStore from '../store/userStore';
import authService from '../services/authService';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import AuthLoginForm from '../components/AuthLoginForm';

const Login: React.FC = () => {
  return <AuthLoginForm />;
};

export default Login; 