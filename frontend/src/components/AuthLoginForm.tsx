import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useUserStore from '../store/userStore';
import authService from '../services/authService';

interface AuthLoginFormProps {
  onSwitchToRegister: () => void;
}

const AuthLoginForm: React.FC<AuthLoginFormProps> = ({ onSwitchToRegister }) => {
  const setUser = useUserStore((state) => state.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      setUser(data.user, data.token);
      window.location.href = '/create-survey';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError(null);
    setForgotMsg(null);
    try {
      await authService.forgotPassword(forgotEmail);
      setForgotMsg('Si el correo existe, se ha enviado un enlace para restablecer la contraseña.');
    } catch (err: any) {
      setForgotError(err.response?.data?.error || 'No se pudo enviar el correo de recuperación');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <Box sx={{ textAlign: 'center', minWidth: 340, maxWidth: 400, width: '100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, letterSpacing: 1 }}>
        Iniciar Sesión
      </Typography>
      <form onSubmit={handleSubmit}>
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
          type={showPassword ? 'text' : 'password'}
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
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" tabIndex={-1}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <Button variant="text" size="small" sx={{ color: '#1976d2', fontWeight: 600 }} onClick={() => setOpenForgot(true)}>
            ¿Olvidaste tu contraseña?
          </Button>
        </Box>
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
          {loading ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>
      <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
        ¿No tienes cuenta?{' '}
        <Button variant="text" onClick={onSwitchToRegister} sx={{ fontWeight: 700, color: '#1976d2' }}>
          Regístrate
        </Button>
      </Typography>
      <Dialog open={openForgot} onClose={() => setOpenForgot(false)}>
        <DialogTitle>Recuperar contraseña</DialogTitle>
        <form onSubmit={handleForgotPassword}>
          <DialogContent>
            <TextField
              label="Correo electrónico"
              type="email"
              fullWidth
              margin="normal"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            {forgotMsg && <Alert severity="success" sx={{ mt: 2 }}>{forgotMsg}</Alert>}
            {forgotError && <Alert severity="error" sx={{ mt: 2 }}>{forgotError}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenForgot(false)} color="secondary">Cancelar</Button>
            <Button type="submit" variant="contained" disabled={forgotLoading}>
              {forgotLoading ? 'Enviando...' : 'Enviar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AuthLoginForm; 