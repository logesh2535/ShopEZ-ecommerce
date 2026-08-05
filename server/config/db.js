import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is always loaded regardless of execution CWD (VS Code root, server dir, IDE, etc.)
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config(); // default cwd fallback

const DEFAULT_ATLAS_URI = 'mongodb+srv://logeshk2535_db_user:F2y4DuCJevYHqN1p@cluster0.b9be3it.mongodb.net/shopez?appName=Cluster0';

let isConnected = null;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return isConnected;
  }

  const mongoUri = process.env.MONGO_URI || DEFAULT_ATLAS_URI;

  try {
    const maskedUri = mongoUri.replace(/:([^@]+)@/, ':****@');
    console.log(`[ShopEZ DB] Connecting to MongoDB: ${maskedUri}`);
    
    isConnected = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log(`✅ [ShopEZ DB] Connected successfully to MongoDB Host: ${isConnected.connection.host}`);
    return isConnected;
  } catch (error) {
    console.error(`❌ [ShopEZ DB Error] Primary connection attempt failed: ${error.message}`);
    
    if (mongoUri !== DEFAULT_ATLAS_URI) {
      console.log(`🔄 [ShopEZ DB] Attempting fallback to cloud MongoDB Atlas URI...`);
      try {
        isConnected = await mongoose.connect(DEFAULT_ATLAS_URI, {
          serverSelectionTimeoutMS: 10000,
        });
        console.log(`✅ [ShopEZ DB] Connected successfully to Fallback Atlas Host: ${isConnected.connection.host}`);
        return isConnected;
      } catch (fallbackErr) {
        console.error(`❌ [ShopEZ DB Error] Fallback connection failed: ${fallbackErr.message}`);
        throw fallbackErr;
      }
    }
    throw error;
  }
};

export default connectDB;
