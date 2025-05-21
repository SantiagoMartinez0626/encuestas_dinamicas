import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  id: String,
  type: String,
  title: String,
  required: Boolean,
  options: [String],
  min: Number,
  max: Number,
});

const SurveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [QuestionSchema],
  createdAt: Date,
  updatedAt: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model('Survey', SurveySchema); 