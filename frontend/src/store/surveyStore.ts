import { create } from 'zustand';
import { Question, Survey } from '../types/survey';

interface SurveyState {
  currentSurvey: Partial<Survey>;
  setCurrentSurvey: (survey: Partial<Survey>) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  addQuestion: (question: Question) => void;
  deleteQuestion: (id: string) => void;
  resetSurvey: () => void;
}

const useSurveyStore = create<SurveyState>((set) => ({
  currentSurvey: {
    title: '',
    description: '',
    questions: [],
  },
  setCurrentSurvey: (survey) => set({ currentSurvey: survey }),
  updateQuestion: (id, updates) =>
    set((state) => ({
      currentSurvey: {
        ...state.currentSurvey,
        questions: state.currentSurvey.questions?.map((q) =>
          q.id === id ? { ...q, ...updates } : q
        ),
      },
    })),
  addQuestion: (question) =>
    set((state) => ({
      currentSurvey: {
        ...state.currentSurvey,
        questions: [...(state.currentSurvey.questions || []), question],
      },
    })),
  deleteQuestion: (id) =>
    set((state) => ({
      currentSurvey: {
        ...state.currentSurvey,
        questions: state.currentSurvey.questions?.filter((q) => q.id !== id),
      },
    })),
  resetSurvey: () =>
    set({
      currentSurvey: {
        title: '',
        description: '',
        questions: [],
      },
    }),
}));

export default useSurveyStore; 