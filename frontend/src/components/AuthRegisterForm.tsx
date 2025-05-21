import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import useUserStore from '../store/userStore';
import authService from '../services/authService';

interface AuthRegisterFormProps {
  onSwitchToLogin: () => void;
}

const AuthRegisterForm: React.FC<AuthRegisterFormProps> = ({ onSwitchToLogin }) => {
  const setUser = useUserStore((state) => state.setUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.register(name, email, password);
      const data = await authService.login(email, password);
      setUser(data.user, data.token);
      window.location.href = '/create-survey';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ textAlign: 'center', minWidth: 340, maxWidth: 400, width: '100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, letterSpacing: 1 }}>
        Registro
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            background: 'rgba(255,255,255,0.7)',
            borderRadius: 2,
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
                boxShadow: '0 0 0 2px #21CBF3',
              },
            },
          }}
        />
        <TextField
          label="Correo electrónico"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            background: 'rgba(255,255,255,0.7)',
            borderRadius: 2,
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
                boxShadow: '0 0 0 2px #21CBF3',
              },
            },
          }}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            background: 'rgba(255,255,255,0.7)',
            borderRadius: 2,
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
                boxShadow: '0 0 0 2px #21CBF3',
              },
            },
          }}
        />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            fontWeight: 700,
            fontSize: '1.1rem',
            py: 1.3,
            borderRadius: 3,
            background: 'linear-gradient(90deg, #1976d2 0%, #21CBF3 100%)',
            boxShadow: 3,
            transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
            '&:hover': {
              background: 'linear-gradient(90deg, #21CBF3 0%, #1976d2 100%)',
              transform: 'scale(1.03) translateY(-2px)',
              boxShadow: 5,
            },
          }}
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </form>
      <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
        ¿Ya tienes cuenta?{' '}
        <Button variant="text" onClick={onSwitchToLogin} sx={{ fontWeight: 700, color: '#1976d2' }}>
          Inicia sesión
        </Button>
      </Typography>
    </Box>
  );
};

export default AuthRegisterForm; 