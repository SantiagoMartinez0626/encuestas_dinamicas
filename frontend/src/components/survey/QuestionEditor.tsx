import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface QuestionEditorProps {
  question: {
    id: string;
    type: string;
    title: string;
    required: boolean;
    options?: string[];
    min?: number;
    max?: number;
  };
  onUpdate: (id: string, updates: any) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onUpdate }) => {
  const [newOption, setNewOption] = useState('');

  const handleAddOption = () => {
    if (newOption.trim() && question.options) {
      onUpdate(question.id, {
        options: [...question.options, newOption.trim()]
      });
      setNewOption('');
    }
  };

  const handleDeleteOption = (index: number) => {
    if (question.options) {
      const newOptions = question.options.filter((_, i) => i !== index);
      onUpdate(question.id, { options: newOptions });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        fullWidth
        label="Pregunta"
        value={question.title}
        onChange={(e) => onUpdate(question.id, { title: e.target.value })}
        margin="normal"
      />

      <FormControlLabel
        control={
          <Switch
            checked={question.required}
            onChange={(e) => onUpdate(question.id, { required: e.target.checked })}
          />
        }
        label="Obligatoria"
      />

      {(question.type === 'multiple' || question.type === 'checkbox') && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Opciones
          </Typography>
          {question.options?.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                fullWidth
                value={option}
                onChange={(e) => {
                  const newOptions = [...(question.options || [])];
                  newOptions[index] = e.target.value;
                  onUpdate(question.id, { options: newOptions });
                }}
                size="small"
              />
              <IconButton
                color="error"
                onClick={() => handleDeleteOption(index)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Nueva opción"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
            />
            <IconButton color="primary" onClick={handleAddOption}>
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
      )}

      {question.type === 'scale' && (
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <TextField
            type="number"
            label="Mínimo"
            value={question.min}
            onChange={(e) => onUpdate(question.id, { min: parseInt(e.target.value) })}
            size="small"
          />
          <TextField
            type="number"
            label="Máximo"
            value={question.max}
            onChange={(e) => onUpdate(question.id, { max: parseInt(e.target.value) })}
            size="small"
          />
        </Box>
      )}
    </Box>
  );
};

export default QuestionEditor; 