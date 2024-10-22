import mongoose from "mongoose";

const connectDB = async () => {
    const Url = 'mongodb+srv://naazir21:naazir21@cluster0.c6aczf3.mongodb.net/hospital?retryWrites=true&w=majority&appName=Cluster0'
    try {
        await mongoose.connect(Url);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error: ", error);
        process.exit(1);
    }
};

export default connectDB;
