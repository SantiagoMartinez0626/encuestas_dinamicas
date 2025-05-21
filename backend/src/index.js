import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Survey from './models/Survey.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/encuestas_db')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ message: 'API de Encuestas Dinámicas' });
});

// Middleware de autenticación JWT
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

// Crear encuesta (protegido)
app.post('/api/surveys', auth, async (req, res) => {
  try {
    const survey = new Survey({ ...req.body, createdBy: req.user.userId });
    await survey.save();
    res.status(201).json(survey);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la encuesta' });
  }
});

// Obtener encuestas propias (protegido)
app.get('/api/surveys', auth, async (req, res) => {
  try {
    const surveys = await Survey.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener encuestas' });
  }
});

// Obtener encuesta pública por ID
app.get('/api/surveys/:id', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ error: 'Encuesta no encontrada' });
    res.json(survey);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la encuesta' });
  }
});

// Modelo de respuesta
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

// Enviar respuesta a encuesta (público)
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

// Obtener respuestas de una encuesta (protegido)
app.get('/api/surveys/:id/responses', auth, async (req, res) => {
  try {
    const responses = await Response.find({ surveyId: req.params.id });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener respuestas' });
  }
});

// Registro de usuario
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

// Login de usuario
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

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 