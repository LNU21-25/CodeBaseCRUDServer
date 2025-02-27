// src/config/db.js
import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...')
    // Use the connection string from environment variables or fallback to local MongoDB.
    const uri = process.env.MONGO_URI
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  }
}
