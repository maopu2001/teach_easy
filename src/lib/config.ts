// Import and rename environment variables
export const config = {
  // Database Configuration
  database: {
    mongodbUri: process.env.MONGODB_URI,
  },

  // Authentication & Security
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
  },

  // Password Hashing Configuration
  password: {
    saltLength: parseInt(process.env.PASSWORD_SALT_LENGTH || "32"),
    iterations: parseInt(process.env.PASSWORD_ITERATIONS || "100000"),
    keyLength: parseInt(process.env.PASSWORD_KEY_LENGTH || "64"),
  },

  // Email Configuration
  email: {
    user: process.env.EMAIL_USER,
    appPassword: process.env.EMAIL_APP_PASSWORD,
  },

  // File Upload Configuration
  file: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880"),
    allowedImageTypes: process.env.ALLOWED_IMAGE_TYPES?.split(",") || [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    imagesPerProduct: parseInt(process.env.IMAGES_PER_PRODUCT || "10"),
  },

  // MinIO S3 Configuration
  s3: {
    endPoint: process.env.NEXT_PUBLIC_MINIO_ENDPOINT || "localhost",
    port: parseInt(process.env.MINIO_PORT || "9000"),
    useSSL: process.env.NEXT_PUBLIC_MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY || "",
    secretKey: process.env.MINIO_SECRET_KEY || "",
    bucket: process.env.NEXT_PUBLIC_MINIO_BUCKET || "teach-easy",
    region: process.env.MINIO_REGION || "us-east-1",
  },

  // Application Configuration
  app: {
    maxItems: parseInt(process.env.NEXT_PUBLIC_MAX_ITEMS || "1"),
    maxReturnDays: parseInt(process.env.MAX_RETURN_DAYS || "30"),
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  },

  // Environment
  env: {
    nodeEnv: process.env.NODE_ENV || "development",
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
  },

  // Admin Configuration
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },
} as const;

export default config;
