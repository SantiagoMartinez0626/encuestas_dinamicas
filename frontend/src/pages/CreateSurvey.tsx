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
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          mb: 4
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Crear Encuesta Dinámica
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ pb: 8 }}>
        <Paper 
          elevation={3}
          sx={{ 
            p: { xs: 2, md: 4 }, 
            borderRadius: 4,
            position: 'relative',
            overflow: 'visible'
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              textAlign: 'center',
              color: 'primary.main',
              mb: 4
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
            sx={{ mb: 3 }}
          />
          
          <TextField
            fullWidth
            label="Descripción"
            value={currentSurvey.description}
            onChange={(e) => setCurrentSurvey({ ...currentSurvey, description: e.target.value })}
            multiline
            rows={3}
            margin="normal"
            sx={{ mb: 4 }}
          />

          <Divider sx={{ my: 4 }} />

          {currentSurvey.questions?.length === 0 && (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 6,
                bgcolor: 'background.default',
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'divider'
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Agrega tu primera pregunta usando el botón <b>+</b> de abajo
              </Typography>
            </Box>
          )}

          {currentSurvey.questions?.map((question, index) => (
            <Box 
              key={question.id} 
              sx={{ 
                mb: 3,
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }}
            >
              {renderQuestion(question)}
              <Tooltip title="Editar pregunta">
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    bgcolor: 'background.paper',
                    boxShadow: 2,
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'white'
                    }
                  }}
                  onClick={() => setEditingQuestion(question)}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ))}

          <Box sx={{ position: 'fixed', bottom: 32, right: 32 }}>
            <Tooltip title="Agregar pregunta">
              <Fab
                color="primary"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  boxShadow: 3,
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
          </Box>

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

          <Dialog
            open={Boolean(editingQuestion)}
            onClose={() => setEditingQuestion(null)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              elevation: 24,
              sx: { borderRadius: 2 }
            }}
          >
            {editingQuestion && (
              <>
                <DialogTitle>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    Editar Pregunta
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <QuestionEditor
                    question={editingQuestion}
                    onUpdate={handleUpdateQuestion}
                  />
                </DialogContent>
              </>
            )}
          </Dialog>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 6 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSaveSurvey}
              disabled={loading || !currentSurvey.title || !currentSurvey.questions?.length}
              sx={{
                px: 6,
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4
                }
              }}
            >
              {loading ? 'Guardando...' : 'Guardar Encuesta'}
            </Button>
          </Box>
        </Paper>
      </Container>

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