import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, IconButton, Snackbar, Alert, CircularProgress, Tooltip } from '@mui/material';
import { ContentCopy as ContentCopyIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import surveyService from '../services/surveyService';
import { Survey } from '../types/survey';
import { Link } from 'react-router-dom';

const MySurveys: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true);
        const data = await surveyService.getSurveys();
        setSurveys(data);
      } catch (err: any) {
        setError('Error al cargar tus encuestas');
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  const handleCopy = (id: string) => {
    const url = `${window.location.origin}/survey/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
        Mis Encuestas
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box sx={{ maxWidth: 700, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {surveys.length === 0 && (
            <Typography color="text.secondary" align="center">
              No has creado ninguna encuesta aún.
            </Typography>
          )}
          {surveys.map((survey) => (
            <Paper key={survey.id || survey._id} sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{survey.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{survey.description}</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Ver encuesta pública">
                    <IconButton component={Link} to={`/survey/${survey.id || survey._id}`} color="primary">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copiar enlace público">
                    <IconButton onClick={() => handleCopy(survey.id || survey._id)} color="secondary">
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
      <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%' }}>¡Enlace copiado!</Alert>
      </Snackbar>
    </Box>
  );
};

export default MySurveys; 