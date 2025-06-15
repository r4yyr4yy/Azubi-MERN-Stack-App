
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


const dbUser = process.env.MONGO_ROOT_USER;
const dbPass = process.env.MONGO_ROOT_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbName = process.env.MONGO_DB_NAME;
const MONGO_URI = `mongodb://${dbUser}:${dbPass}@${dbHost}:27017/${dbName}?authSource=admin`;

console.log('Attempting to connect to MongoDB...');
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });


const todoSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  isCompleted: { type: Boolean, default: false },
  
  date: { type: String },
  activity: { type: String },
  strStatus: { type: String },
});
const Todos = mongoose.model('Todos', todoSchema);


app.get('/api/gettodos', async (req, res) => {
  try {
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    
    const totalTodos = await Todos.countDocuments();
    const numOfPages = Math.ceil(totalTodos / limit);

    
    const todoList = await Todos.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    
    return res.status(200).json({ todoList, numOfPages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/api/todos', async (req, res) => {
  try {
    const todo = new Todos(req.body);
    await todo.save();
    return res.status(201).json({ todo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todos.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    return res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTodo = await Todos.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    return res.status(200).json({ todo: updatedTodo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});