import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, IconButton, Snackbar, Alert, CircularProgress, Tooltip } from '@mui/material';
import { ContentCopy as ContentCopyIcon, Visibility as VisibilityIcon, Delete as DeleteIcon } from '@mui/icons-material';
import surveyService from '../services/surveyService';
import { Survey } from '../types/survey';
import { Link } from 'react-router-dom';

const MySurveys: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta encuesta? Esta acción no se puede deshacer.')) return;
    try {
      setDeleting(id);
      await surveyService.deleteSurvey(id);
      setSurveys((prev) => prev.filter((s) => (s.id || s._id) !== id));
    } catch (err) {
      setError('Error al eliminar la encuesta');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', py: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center', color: '#222' }}>
        Mis Encuestas
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box sx={{ maxWidth: 700, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {surveys.length === 0 && (
            <Typography color="text.secondary" align="center">
              No has creado ninguna encuesta aún.
            </Typography>
          )}
          {surveys.map((survey) => (
            <Box
              key={survey.id || survey._id}
              sx={{
                background: '#fff',
                borderRadius: 3,
                boxShadow: '0 2px 8px 0 rgba(60,64,67,.08)',
                borderLeft: '6px solid #1976d2',
                p: { xs: 2, md: 3 },
                mb: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'box-shadow 0.2s',
                '&:hover': {
                  boxShadow: '0 4px 16px 0 rgba(60,64,67,.16)',
                },
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#222', mb: 0.5 }}>{survey.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{survey.description}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                {String(survey.createdBy) === localStorage.getItem('userId') && (
                  <Tooltip title="Ver encuesta y análisis">
                    <IconButton component={Link} to={`/survey/${survey.id || survey._id}`} sx={{ color: '#1976d2', bgcolor: '#e3f0fd', '&:hover': { bgcolor: '#1976d2', color: '#fff' }, transition: 'all 0.2s' }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Copiar enlace público">
                  <IconButton onClick={() => handleCopy(survey.id || survey._id)} sx={{ color: '#9c27b0', bgcolor: '#f3e6fa', '&:hover': { bgcolor: '#9c27b0', color: '#fff' }, transition: 'all 0.2s' }}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar encuesta">
                  <span>
                    <IconButton onClick={() => handleDelete(survey.id || survey._id)} sx={{ color: '#d32f2f', bgcolor: '#fdeaea', '&:hover': { bgcolor: '#d32f2f', color: '#fff' }, transition: 'all 0.2s' }} disabled={deleting === (survey.id || survey._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Box>
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