const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/social_network', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
