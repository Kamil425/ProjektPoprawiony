import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
        const mongodbUri = process.env.MONGODB_URI || ""; 
        await mongoose.connect(mongodbUri);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
    }
}
