import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Survey from './models/Survey.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/encuestas_db')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

app.get('/', (req, res) => {
  res.json({ message: 'API de Encuestas Dinámicas' });
});

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

app.post('/api/surveys', auth, async (req, res) => {
  try {
    const survey = new Survey({ ...req.body, createdBy: req.user.userId });
    await survey.save();
    res.status(201).json(survey);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la encuesta' });
  }
});

app.get('/api/surveys', auth, async (req, res) => {
  try {
    const surveys = await Survey.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener encuestas' });
  }
});

app.get('/api/surveys/:id', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ error: 'Encuesta no encontrada' });
    res.json(survey);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la encuesta' });
  }
});

const ResponseSchema = new mongoose.Schema({
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey', required: true },
  answers: [
    {
      questionId: String,
      value: mongoose.Schema.Types.Mixed,
    }
  ],
  submittedAt: { type: Date, default: Date.now },
});
const Response = mongoose.models.Response || mongoose.model('Response', ResponseSchema);

app.post('/api/surveys/:id/responses', async (req, res) => {
  try {
    const { answers } = req.body;
    const response = new Response({ surveyId: req.params.id, answers });
    await response.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar la respuesta' });
  }
});

app.get('/api/surveys/:id/responses', async (req, res) => {
  try {
    let userId = null;
    // Intenta extraer el usuario del token si existe
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        userId = decoded.userId;
      } catch (err) {
        // Token inválido, ignorar
      }
    }
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ error: 'Encuesta no encontrada' });
    // Solo el creador puede ver las respuestas
    if (userId && String(survey.createdBy) === String(userId)) {
      const responses = await Response.find({ surveyId: req.params.id });
      return res.json(responses);
    } else {
      return res.json([]); // No mostrar respuestas a otros
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener respuestas' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'El correo ya está registrado' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' });
    const token = jwt.sign({ userId: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

app.delete('/api/surveys/:id', auth, async (req, res) => {
  try {
    const survey = await Survey.findOneAndDelete({ _id: req.params.id, createdBy: req.user.userId });
    if (!survey) return res.status(404).json({ error: 'Encuesta no encontrada o no tienes permisos' });
    res.json({ message: 'Encuesta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la encuesta' });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    res.json({ message: 'Si el correo existe, se ha enviado un enlace para restablecer la contraseña.' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo procesar la solicitud de recuperación.' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 