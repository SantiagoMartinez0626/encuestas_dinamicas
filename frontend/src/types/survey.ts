export interface Question {
  id: string;
  type: 'short' | 'long' | 'multiple' | 'checkbox' | 'scale';
  title: string;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: {
    questionId: string;
    value: string | string[] | number;
  }[];
  submittedAt: Date;
  submittedBy: string;
} 