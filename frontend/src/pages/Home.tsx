import React from 'react';
import { Box, Typography, Container, Paper, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { Assessment as AssessmentIcon } from '@mui/icons-material';

const Home: React.FC = () => {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={6}
              sx={{ 
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                textAlign: 'center'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <AssessmentIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <Typography 
                variant="h2" 
                color="primary" 
                sx={{ 
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                QBox
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3,
                  fontWeight: 500,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  color: 'text.primary'
                }}
              >
                Sistema web de encuestas dinámicas con analítica avanzada de resultados
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.6
                }}
              >
                Crea, personaliza y analiza encuestas de manera sencilla y profesional. 
                Descubre insights valiosos con reportes visuales y toma mejores decisiones.
              </Typography>
              <Button 
                component={Link} 
                to="/create-survey" 
                variant="contained" 
                color="primary" 
                size="large" 
                sx={{ 
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: 3,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 5,
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Comenzar ahora
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 