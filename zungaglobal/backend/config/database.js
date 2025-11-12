// backend/config/database.js
import mongoose from 'mongoose';

const connectDatabase = async () => {
  try {
    console.log('\n🔗 Attempting to connect to MongoDB...');
    console.log(`📁 Database: ${process.env.MONGODB_URI}`);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`👤 User: ${conn.connection.user || 'Not specified'}`);
    console.log(`🔄 Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('🟢 Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('🔴 Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🟡 Mongoose disconnected from DB');
    });

  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    console.error(`   Stack: ${error.stack}`);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   1. Check if MongoDB is running');
    console.log('   2. Verify MONGODB_URI in .env file');
    console.log('   3. Check network connection');
    console.log('   4. Verify database credentials\n');
    process.exit(1);
  }
};

export default connectDatabase;