const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3030;

// Set the `strictQuery` option
mongoose.set('strictQuery', true);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from public directory

// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://root:password@mongodbforjing:27017/students_users';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define Student schema and model
const studentSchema = new mongoose.Schema({
  studentCode: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  telNumber: { type: String, required: true }
});
const Student = mongoose.model('Student', studentSchema);

// CRUD API for Students

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new student
app.post('/api/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Update a student
app.put('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).send('Student not found');
    res.json(student);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete a student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const result = await Student.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send('Student not found');
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Serve the index.html file from the public directory
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
