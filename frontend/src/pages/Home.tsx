import React, { useState } from 'react';
import { Box, Typography, Grid, Chip } from '@mui/material';
import { Assessment as AssessmentIcon } from '@mui/icons-material';
import AuthLoginForm from '../components/AuthLoginForm';
import AuthRegisterForm from '../components/AuthRegisterForm';

const Home: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #2196F3 0%, #21CBF3 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Efecto de fondo animado */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 80% 20%, #ffffff33 0%, transparent 60%)',
          animation: 'moveBg 8s linear infinite alternate',
          '@keyframes moveBg': {
            '0%': { backgroundPosition: '80% 20%' },
            '100%': { backgroundPosition: '20% 80%' },
          },
        }}
      />
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '80vh', zIndex: 1 }}>
        <Grid item xs={12} md={7} lg={6}>
          <Box
            sx={{
              px: { xs: 2, md: 8 },
              py: { xs: 6, md: 10 },
              borderRadius: 8,
              background: 'rgba(255,255,255,0.35)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'visible',
              mr: { md: 4 },
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <AssessmentIcon sx={{ fontSize: 80, color: 'primary.main', mb: 1 }} />
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                mb: 2,
                fontSize: { xs: '2.5rem', md: '4rem' },
                color: '#1976d2',
                letterSpacing: 1,
                textShadow: '0 2px 12px #fff, 0 1px 1px #1976d2',
              }}
            >
              QBox
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mb: 3,
                fontWeight: 700,
                fontSize: { xs: '1.3rem', md: '2rem' },
                color: 'text.primary',
                letterSpacing: 0.5,
              }}
            >
              Plataforma inteligente para encuestas dinámicas y análisis avanzado de resultados
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 5,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.7,
                maxWidth: 700,
                mx: 'auto',
              }}
            >
              QBox te permite crear, personalizar y distribuir encuestas de manera sencilla y profesional. Analiza los resultados en tiempo real con reportes visuales, detecta tendencias y obtén insights accionables para tomar mejores decisiones. Ideal para empresas, instituciones educativas y equipos de investigación que buscan optimizar la recolección y el análisis de datos.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={5} lg={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            sx={{
              px: { xs: 2, md: 4 },
              py: { xs: 4, md: 6 },
              borderRadius: 6,
              background: 'rgba(255,255,255,0.18)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              minWidth: 340,
              maxWidth: 400,
              width: '100%',
            }}
          >
            {showRegister ? (
              <AuthRegisterForm onSwitchToLogin={() => setShowRegister(false)} />
            ) : (
              <AuthLoginForm onSwitchToRegister={() => setShowRegister(true)} />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 