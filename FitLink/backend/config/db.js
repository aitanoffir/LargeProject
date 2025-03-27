import mongoose from "mongoose";

export const connectDB = async () => {

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error){
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1);  //process code 1 code means with failure, 0 means success
    }
}