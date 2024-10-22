import express from 'express';
import connectDB from './config/db.js';

// Import Routes
import authRoutes from'./routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import labRoutes from './routes/labRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import pharmacistRoutes from './routes/pharmacistRoutes.js';


// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Connect to database
connectDB();

// Initialize the express app
const app = express();
app.use(express.json());
// app.use(cors());          // Enable CORS for cross-origin requests
// app.use(morgan('dev'));   // HTTP request logger for development
// app.use(helmet());        // Security middleware (adds various HTTP headers)

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/prescribtion', prescriptionRoutes);
app.use('/api/pharmacist', pharmacistRoutes);
// Lab routes
app.use('/api/lab', labRoutes);


const PORT = process.env.PORT || 5000;

// Home route for basic API info or health check
app.get('/', (req, res) => {
    //res.json({ message: "Welcome to the Hospital Management API" });
    res.send("Welcome to the Hospital Management API");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
