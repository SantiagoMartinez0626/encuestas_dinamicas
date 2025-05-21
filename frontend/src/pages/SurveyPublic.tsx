import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Button, TextField, CircularProgress, Alert, Snackbar } from '@mui/material';
import surveyService from '../services/surveyService';
import { Survey } from '../types/survey';

const SurveyPublic: React.FC = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<any>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        setLoading(true);
        const data = await surveyService.getSurveyById(id!);
        setSurvey(data);
      } catch (err: any) {
        setError('Encuesta no encontrada');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSurvey();
  }, [id]);

  const handleChange = (questionId: string, value: any) => {
    setAnswers((prev: any) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await surveyService.submitResponse(id!, {
        answers: Object.entries(answers).map(([questionId, value]) => ({ questionId, value }))
      });
      setSuccess(true);
      setAnswers({});
    } catch (err) {
      setError('Error al enviar la respuesta');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!survey) return null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
      <Paper sx={{ maxWidth: 700, mx: 'auto', p: 4, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>{survey.title}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>{survey.description}</Typography>
        <form onSubmit={handleSubmit}>
          {survey.questions.map((q) => (
            <Box key={q.id} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{q.title}{q.required && <span style={{ color: 'red' }}>*</span>}</Typography>
              <TextField
                fullWidth
                required={q.required}
                value={answers[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
                placeholder={q.type === 'long' ? 'Respuesta larga...' : 'Respuesta corta...'}
                multiline={q.type === 'long'}
                rows={q.type === 'long' ? 3 : 1}
                sx={{ mt: 1 }}
              />
            </Box>
          ))}
          <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2, fontWeight: 600 }}>
            Enviar Respuestas
          </Button>
        </form>
      </Paper>
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%' }}>¡Respuestas enviadas correctamente!</Alert>
      </Snackbar>
    </Box>
  );
};

export default SurveyPublic; 