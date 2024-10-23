import express, { json } from 'express';
import { connect, Schema, model } from 'mongoose';
import cors from 'cors';
const app = express();
app.use(json())
app.use(cors())

MONGODB_URI='mongodb+srv://santhoshjayavelu57:FFQflCmEjHcyq5xQ@todoapp.lmeo6.mongodb.net/todoapp?retryWrites=true&w=majority'

connect(process.env.MONGODB_URI)
  .then(() => console.log('DB connected'))
  .catch((err) => {
    console.error('DB connection error:', err);
    process.exit(1);
  });

// Define Todo schema and model
const todoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const Todo = model('Todo', todoSchema);

// Routes
// POST: Create a new todo
app.post('/todo', async (req, res) => {
  const { title, description } = req.body;

  // Validate request body
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const newTodo = new Todo({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET: Retrieve all todos
app.get('/todo', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT: Update a todo by ID
app.put('/todo/:id', async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  // Validate request body
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE: Delete a todo by ID
app.delete('/todo/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});