import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Button, TextField, CircularProgress, Alert, Snackbar } from '@mui/material';
import surveyService from '../services/surveyService';
import { Survey, SurveyResponse } from '../types/survey';
import useUserStore from '../store/userStore';

const SurveyPublic: React.FC = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<any>({});
  const [success, setSuccess] = useState(false);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        setLoading(true);
        const data = await surveyService.getSurveyById(id!);
        setSurvey(data);
        const resps = await surveyService.getSurveyResponses(id!);
        setResponses(resps);
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

  const isOwner = !!user && survey && (String(survey.createdBy) === user.id);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!survey) return null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
      <Paper sx={{ maxWidth: 700, mx: 'auto', p: 4, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>{survey.title}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{survey.description}</Typography>
        {isOwner && (
          <Typography variant="subtitle2" sx={{ color: '#1976d2', mb: 3 }}>
            Total de respuestas: <b>{responses.length}</b>
          </Typography>
        )}
        <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
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
        {isOwner && (
          <>
            <Box sx={{ mt: 4, p: 3, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1976d2' }}>
                Análisis de respuestas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aquí aparecerá el análisis de las respuestas recibidas (gráficas, promedios, etc.)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                (Próximamente)
              </Typography>
            </Box>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1976d2' }}>
                Respuestas individuales
              </Typography>
              {responses.length === 0 ? (
                <Typography color="text.secondary">Aún no hay respuestas.</Typography>
              ) : (
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid #e0e0e0', padding: 8, background: '#f8f9fa' }}>#</th>
                        {survey.questions.map((q) => (
                          <th key={q.id} style={{ border: '1px solid #e0e0e0', padding: 8, background: '#f8f9fa' }}>{q.title}</th>
                        ))}
                        <th style={{ border: '1px solid #e0e0e0', padding: 8, background: '#f8f9fa' }}>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responses.map((resp, idx) => (
                        <tr key={resp.id || resp._id}>
                          <td style={{ border: '1px solid #e0e0e0', padding: 8, textAlign: 'center' }}>{idx + 1}</td>
                          {survey.questions.map((q) => {
                            const ans = resp.answers.find((a) => a.questionId === q.id);
                            let value = ans ? ans.value : '';
                            if (Array.isArray(value)) value = value.join(', ');
                            return (
                              <td key={q.id} style={{ border: '1px solid #e0e0e0', padding: 8 }}>{value}</td>
                            );
                          })}
                          <td style={{ border: '1px solid #e0e0e0', padding: 8, fontSize: 12, color: '#888' }}>{resp.submittedAt ? new Date(resp.submittedAt).toLocaleString() : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              )}
            </Box>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1976d2' }}>
                Analítica por pregunta
              </Typography>
              {survey.questions.map((q, idx) => {
                const respuestas = responses.map(r => {
                  const ans = r.answers.find(a => a.questionId === q.id);
                  return ans ? ans.value : undefined;
                }).filter(v => v !== undefined);

                if (q.type === 'short' || q.type === 'long') {
                  return (
                    <Box key={q.id} sx={{ mb: 3 }}>
                      <Typography sx={{ fontWeight: 600, mb: 1 }}>{idx + 1}. {q.title}</Typography>
                      {respuestas.length === 0 ? (
                        <Typography color="text.secondary" sx={{ fontSize: 14 }}>Sin respuestas.</Typography>
                      ) : (
                        <Box sx={{ pl: 2 }}>
                          {respuestas.map((r, i) => (
                            <Typography key={i} sx={{ fontSize: 15, mb: 0.5 }}>- {r}</Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  );
                }
                if (q.type === 'multiple' || q.type === 'checkbox') {
                  const counts: Record<string, number> = {};
                  (q.options || []).forEach(opt => { counts[opt] = 0; });
                  respuestas.forEach(r => {
                    if (Array.isArray(r)) {
                      r.forEach((opt: string) => { if (counts[opt] !== undefined) counts[opt]++; });
                    } else if (typeof r === 'string' && counts[r] !== undefined) {
                      counts[r]++;
                    }
                  });
                  return (
                    <Box key={q.id} sx={{ mb: 3 }}>
                      <Typography sx={{ fontWeight: 600, mb: 1 }}>{idx + 1}. {q.title}</Typography>
                      {Object.keys(counts).length === 0 ? (
                        <Typography color="text.secondary" sx={{ fontSize: 14 }}>Sin opciones.</Typography>
                      ) : (
                        <Box sx={{ pl: 2 }}>
                          {Object.entries(counts).map(([opt, count]) => (
                            <Box key={opt} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Box sx={{ width: 120, fontSize: 15 }}>{opt}</Box>
                              <Box sx={{ height: 16, width: `${Math.max(8, count * 20)}px`, bgcolor: '#1976d2', borderRadius: 1, mx: 1 }} />
                              <Typography sx={{ fontSize: 15 }}>{count}</Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  );
                }
                if (q.type === 'scale') {
                  const nums = respuestas.map(r => typeof r === 'number' ? r : parseInt(r as string)).filter(n => !isNaN(n));
                  const avg = nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2) : '-';
                  const min = nums.length ? Math.min(...nums) : '-';
                  const max = nums.length ? Math.max(...nums) : '-';
                  const dist: Record<number, number> = {};
                  for (let i = q.min || 1; i <= (q.max || 5); i++) dist[i] = 0;
                  nums.forEach(n => { if (dist[n] !== undefined) dist[n]++; });
                  return (
                    <Box key={q.id} sx={{ mb: 3 }}>
                      <Typography sx={{ fontWeight: 600, mb: 1 }}>{idx + 1}. {q.title}</Typography>
                      {nums.length === 0 ? (
                        <Typography color="text.secondary" sx={{ fontSize: 14 }}>Sin respuestas.</Typography>
                      ) : (
                        <Box sx={{ pl: 2 }}>
                          <Typography sx={{ fontSize: 15, mb: 0.5 }}>Promedio: <b>{avg}</b> &nbsp; | &nbsp; Mín: <b>{min}</b> &nbsp; | &nbsp; Máx: <b>{max}</b></Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            {Object.entries(dist).map(([val, count]) => (
                              <Box key={val} sx={{ textAlign: 'center' }}>
                                <Typography sx={{ fontSize: 14 }}>{val}</Typography>
                                <Box sx={{ height: 16, width: `${Math.max(8, count * 20)}px`, bgcolor: '#1976d2', borderRadius: 1, mx: 'auto', mb: 0.5 }} />
                                <Typography sx={{ fontSize: 13 }}>{count}</Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  );
                }
                return null;
              })}
            </Box>
          </>
        )}
      </Paper>
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%' }}>¡Respuestas enviadas correctamente!</Alert>
      </Snackbar>
    </Box>
  );
};

export default SurveyPublic; 