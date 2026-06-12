export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  IMAGE_MAX_SIZE: process.env.IMAGE_MAX_SIZE || 5242880,
  IMAGE_UPLOAD_DIR: process.env.IMAGE_UPLOAD_DIR || './uploads',
};

export const validateConfig = () => {
  if (!config.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  if (!config.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
};
