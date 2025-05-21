import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import { DragIndicator, Delete } from '@mui/icons-material';

interface QuestionBaseProps {
  id: string;
  title: string;
  required: boolean;
  onDelete: (id: string) => void;
  children: React.ReactNode;
}

const QuestionBase: React.FC<QuestionBaseProps> = ({
  id,
  title,
  required,
  onDelete,
  children
}) => {
  return (
    <Card sx={{ mb: 2, position: 'relative' }}>
      <Box sx={{ position: 'absolute', left: -30, top: '50%', transform: 'translateY(-50%)' }}>
        <DragIndicator sx={{ color: 'text.secondary' }} />
      </Box>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {title}
            {required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
          </Typography>
          <IconButton onClick={() => onDelete(id)} color="error" size="small">
            <Delete />
          </IconButton>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};

export default QuestionBase; 