import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Fab,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import {
  ShortTextQuestion,
  LongTextQuestion,
  MultipleChoiceQuestion,
  CheckboxQuestion,
  ScaleQuestion,
} from '../components/survey/QuestionTypes';
import QuestionEditor from '../components/survey/QuestionEditor';
import useSurveyStore from '../store/surveyStore';
import { Question } from '../types/survey';
import surveyService from '../services/surveyService';

const CreateSurvey: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    currentSurvey,
    setCurrentSurvey,
    updateQuestion,
    addQuestion,
    deleteQuestion,
    resetSurvey,
  } = useSurveyStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: uuidv4(),
      type,
      title: 'Nueva pregunta',
      required: false,
      ...(type === 'multiple' || type === 'checkbox' ? { options: ['Opción 1'] } : {}),
      ...(type === 'scale' ? { min: 1, max: 5 } : {}),
    };
    addQuestion(newQuestion);
    setAnchorEl(null);
  };

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
    updateQuestion(id, updates);
  };

  const handleSaveSurvey = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!currentSurvey.title) {
        throw new Error('El título de la encuesta es requerido');
      }

      if (!currentSurvey.questions?.length) {
        throw new Error('La encuesta debe tener al menos una pregunta');
      }

      const survey = await surveyService.createSurvey({
        ...currentSurvey,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      resetSurvey();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la encuesta');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const props = {
      id: question.id,
      title: question.title,
      required: question.required,
      onDelete: deleteQuestion,
    };

    switch (question.type) {
      case 'short':
        return <ShortTextQuestion {...props} />;
      case 'long':
        return <LongTextQuestion {...props} />;
      case 'multiple':
        return <MultipleChoiceQuestion {...props} options={question.options || []} />;
      case 'checkbox':
        return <CheckboxQuestion {...props} options={question.options || []} />;
      case 'scale':
        return <ScaleQuestion {...props} min={question.min || 1} max={question.max || 5} />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 6,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 700,
          background: '#fff',
          borderRadius: 3,
          boxShadow: '0 2px 8px 0 rgba(60,64,67,.08)',
          mb: 4,
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 4 },
          borderLeft: '6px solid #1976d2',
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: '#1976d2',
            mb: 2,
            letterSpacing: 0.5,
          }}
        >
          Nueva Encuesta
        </Typography>
        <TextField
          fullWidth
          label="Título de la encuesta"
          value={currentSurvey.title}
          onChange={(e) => setCurrentSurvey({ ...currentSurvey, title: e.target.value })}
          margin="normal"
          required
          error={!currentSurvey.title}
          helperText={!currentSurvey.title ? 'El título es requerido' : ''}
          sx={{
            background: '#f8f9fa',
            borderRadius: 2,
            mb: 2,
            '& .MuiOutlinedInput-root': {
              background: '#f8f9fa',
              borderRadius: 2,
              '& fieldset': {
                borderColor: '#dadce0',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
                boxShadow: '0 0 0 2px #21CBF3',
              },
            },
            '& .MuiFormHelperText-root': {
              color: '#d32f2f',
              fontWeight: 600,
            },
          }}
        />
        <TextField
          fullWidth
          label="Descripción"
          value={currentSurvey.description}
          onChange={(e) => setCurrentSurvey({ ...currentSurvey, description: e.target.value })}
          multiline
          rows={3}
          margin="normal"
          sx={{
            background: '#f8f9fa',
            borderRadius: 2,
            mb: 1,
            '& .MuiOutlinedInput-root': {
              background: '#f8f9fa',
              borderRadius: 2,
              '& fieldset': {
                borderColor: '#dadce0',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
                boxShadow: '0 0 0 2px #21CBF3',
              },
            },
          }}
        />
      </Box>
      <Box sx={{ width: '100%', maxWidth: 700 }}>
        {currentSurvey.questions?.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              bgcolor: '#fff',
              borderRadius: 3,
              border: '2px dashed #dadce0',
              color: '#888',
              mb: 4,
              boxShadow: '0 2px 8px 0 rgba(60,64,67,.08)',
            }}
          >
            <Typography variant="body1">
              Agrega tu primera pregunta usando el botón <b>+</b> de la derecha
            </Typography>
          </Box>
        )}
        {currentSurvey.questions?.map((question, index) => (
          <Box
            key={question.id}
            sx={{
              mb: 4,
              background: '#fff',
              borderRadius: 3,
              boxShadow: '0 2px 8px 0 rgba(60,64,67,.08)',
              borderLeft: '6px solid #1976d2',
              p: { xs: 2, md: 3 },
              position: 'relative',
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: '0 4px 16px 0 rgba(60,64,67,.16)',
              },
            }}
          >
            <QuestionEditor question={question} onUpdate={handleUpdateQuestion} />
            <Tooltip title="Eliminar pregunta">
              <IconButton
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  bgcolor: '#fdeaea',
                  color: '#d32f2f',
                  boxShadow: 1,
                  '&:hover': {
                    bgcolor: '#d32f2f',
                    color: '#fff',
                  },
                }}
                onClick={() => deleteQuestion(question.id)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </IconButton>
            </Tooltip>
          </Box>
        ))}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            elevation: 3,
            sx: { mt: 1 }
          }}
        >
          <MenuItem onClick={() => handleAddQuestion('short')}>Texto Corto</MenuItem>
          <MenuItem onClick={() => handleAddQuestion('long')}>Texto Largo</MenuItem>
          <MenuItem onClick={() => handleAddQuestion('multiple')}>Opción Múltiple</MenuItem>
          <MenuItem onClick={() => handleAddQuestion('checkbox')}>Casillas de Verificación</MenuItem>
          <MenuItem onClick={() => handleAddQuestion('scale')}>Escala</MenuItem>
        </Menu>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 8 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSaveSurvey}
            disabled={loading || !currentSurvey.title || !currentSurvey.questions?.length}
            sx={{
              px: 6,
              py: 1.5,
              fontWeight: 700,
              borderRadius: 3,
              background: 'linear-gradient(90deg, #1976d2 0%, #21CBF3 100%)',
              color: '#fff',
              boxShadow: 3,
              letterSpacing: 1,
              transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
              '&:hover': {
                background: 'linear-gradient(90deg, #21CBF3 0%, #1976d2 100%)',
                boxShadow: 5,
              },
              opacity: loading || !currentSurvey.title || !currentSurvey.questions?.length ? 0.6 : 1,
            }}
          >
            {loading ? 'Guardando...' : 'Guardar Encuesta'}
          </Button>
        </Box>
      </Box>
      <Box sx={{ position: 'fixed', top: 100, right: 32 }}>
        <Tooltip title="Agregar pregunta">
          <Fab
            color="primary"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              boxShadow: 3,
              '&:hover': {
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
              background: '#fff',
              color: '#1976d2',
              border: '2px solid #1976d2',
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ width: '100%' }}
          elevation={6}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateSurvey; 