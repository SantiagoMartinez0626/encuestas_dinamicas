import React from 'react';
import { TextField, Radio, RadioGroup, FormControlLabel, Checkbox, FormControl, FormLabel, Box, Typography } from '@mui/material';
import QuestionBase from './QuestionBase';

// Pregunta de texto corto
export const ShortTextQuestion: React.FC<{
  id: string;
  title: string;
  required: boolean;
  onDelete: (id: string) => void;
}> = ({ id, title, required, onDelete }) => (
  <QuestionBase id={id} title={title} required={required} onDelete={onDelete}>
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Respuesta corta"
      disabled
    />
  </QuestionBase>
);

// Pregunta de texto largo
export const LongTextQuestion: React.FC<{
  id: string;
  title: string;
  required: boolean;
  onDelete: (id: string) => void;
}> = ({ id, title, required, onDelete }) => (
  <QuestionBase id={id} title={title} required={required} onDelete={onDelete}>
    <TextField
      fullWidth
      multiline
      rows={4}
      variant="outlined"
      placeholder="Respuesta larga"
      disabled
    />
  </QuestionBase>
);

// Pregunta de opción múltiple
export const MultipleChoiceQuestion: React.FC<{
  id: string;
  title: string;
  required: boolean;
  onDelete: (id: string) => void;
  options: string[];
}> = ({ id, title, required, onDelete, options }) => (
  <QuestionBase id={id} title={title} required={required} onDelete={onDelete}>
    <FormControl component="fieldset">
      <RadioGroup>
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option}
            control={<Radio disabled />}
            label={option}
          />
        ))}
      </RadioGroup>
    </FormControl>
  </QuestionBase>
);

// Pregunta de casillas de verificación
export const CheckboxQuestion: React.FC<{
  id: string;
  title: string;
  required: boolean;
  onDelete: (id: string) => void;
  options: string[];
}> = ({ id, title, required, onDelete, options }) => (
  <QuestionBase id={id} title={title} required={required} onDelete={onDelete}>
    <FormControl component="fieldset">
      {options.map((option, index) => (
        <FormControlLabel
          key={index}
          control={<Checkbox disabled />}
          label={option}
        />
      ))}
    </FormControl>
  </QuestionBase>
);

// Pregunta de escala
export const ScaleQuestion: React.FC<{
  id: string;
  title: string;
  required: boolean;
  onDelete: (id: string) => void;
  min: number;
  max: number;
}> = ({ id, title, required, onDelete, min, max }) => (
  <QuestionBase id={id} title={title} required={required} onDelete={onDelete}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography>{min}</Typography>
      <RadioGroup row>
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((value) => (
          <FormControlLabel
            key={value}
            value={value.toString()}
            control={<Radio disabled />}
            label={value}
          />
        ))}
      </RadioGroup>
      <Typography>{max}</Typography>
    </Box>
  </QuestionBase>
); 