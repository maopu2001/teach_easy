import mongoose from "mongoose";
import crypto from "crypto";

const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
};

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const [salt, hash] = hashedPassword.split(":");
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === verifyHash;
};

export const authSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Password Management
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now,
    },
    previousPasswords: [
      {
        password: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],

    // Email Verification
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    emailVerificationAttempts: { type: Number, default: 0 },

    // Password Reset
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordResetAttempts: { type: Number, default: 0 },

    // Session Management
    refreshTokens: [
      {
        token: { type: String, required: true },
        deviceInfo: {
          userAgent: String,
          ip: String,
          device: String,
          browser: String,
          os: String,
        },
        createdAt: { type: Date, default: Date.now },
        expiresAt: Date,
        lastUsedAt: Date,
        isActive: { type: Boolean, default: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
authSchema.index({ emailVerificationToken: 1 });
authSchema.index({ passwordResetToken: 1 });
authSchema.index({ "refreshTokens.token": 1 });
authSchema.index({ "refreshTokens.expiresAt": 1 });

// Pre-save middleware to hash password
authSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = hashPassword(this.password);
    this.passwordChangedAt = new Date();

    next();
  } catch (error) {
    next(error as Error);
  }
});

authSchema.methods.correctPassword = function (
  candidatePassword: string,
  userPassword: string
) {
  return verifyPassword(candidatePassword, userPassword);
};

authSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

authSchema.methods.cleanExpiredTokens = function () {
  const now = new Date();
  this.refreshTokens = this.refreshTokens.filter(
    (token: { expiresAt: Date }) => token.expiresAt && token.expiresAt > now
  );
  return this.save();
};

authSchema.methods.revokeAllTokens = function () {
  this.refreshTokens = [];
  return this.save();
};

authSchema.methods.isPasswordReused = function (newPassword: string) {
  for (const prevPassword of this.previousPasswords) {
    if (verifyPassword(newPassword, prevPassword.password)) return true;
  }
  return false;
};

export const Auth = mongoose.models.Auth || mongoose.model("Auth", authSchema);
