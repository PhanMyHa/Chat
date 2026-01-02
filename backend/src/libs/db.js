import mongoose from 'mongoose';

export const connectDB= async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("ket noi DB thanh cong")
    } catch (error) {
        console.log('loi ket noi DB', error)
        process.exit(1);
    }
}