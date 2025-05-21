import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from './theme';
import Home from './pages/Home';
import CreateSurvey from './pages/CreateSurvey';
import Login from './pages/Login';
import Register from './pages/Register';
import MySurveys from './pages/MySurveys';
import SurveyPublic from './pages/SurveyPublic';
import useUserStore from './store/userStore';
import AppHeader from './components/AppHeader';

const queryClient = new QueryClient();

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useUserStore((state) => state.token) || localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppHeader />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-survey" element={
              <PrivateRoute>
                <CreateSurvey />
              </PrivateRoute>
            } />
            <Route path="/my-surveys" element={
              <PrivateRoute>
                <MySurveys />
              </PrivateRoute>
            } />
            <Route path="/survey/:id" element={<SurveyPublic />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App; 