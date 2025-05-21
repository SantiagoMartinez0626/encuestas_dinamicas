import axios from 'axios';
import { Survey, SurveyResponse } from '../types/survey';
import useUserStore from '../store/userStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = useUserStore.getState().token || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const surveyService = {
  // Crear una nueva encuesta
  createSurvey: async (survey: Partial<Survey>): Promise<Survey> => {
    const response = await axios.post(
      `${API_URL}/api/surveys`,
      survey,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Obtener todas las encuestas
  getSurveys: async (): Promise<Survey[]> => {
    const response = await axios.get(
      `${API_URL}/api/surveys`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Obtener una encuesta por ID
  getSurveyById: async (id: string): Promise<Survey> => {
    const response = await axios.get(`${API_URL}/api/surveys/${id}`);
    return response.data;
  },

  // Actualizar una encuesta
  updateSurvey: async (id: string, survey: Partial<Survey>): Promise<Survey> => {
    const response = await axios.put(
      `${API_URL}/api/surveys/${id}`,
      survey,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Eliminar una encuesta
  deleteSurvey: async (id: string): Promise<void> => {
    await axios.delete(
      `${API_URL}/api/surveys/${id}`,
      { headers: getAuthHeaders() }
    );
  },

  // Enviar una respuesta a una encuesta
  submitResponse: async (surveyId: string, response: Partial<SurveyResponse>): Promise<SurveyResponse> => {
    const res = await axios.post(`${API_URL}/api/surveys/${surveyId}/responses`, response);
    return res.data;
  },

  // Obtener las respuestas de una encuesta
  getSurveyResponses: async (surveyId: string): Promise<SurveyResponse[]> => {
    const response = await axios.get(
      `${API_URL}/api/surveys/${surveyId}/responses`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
};

export default surveyService; 