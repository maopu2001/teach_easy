export interface DeviceInfo {
  userAgent?: string;
  ip?: string;
  device?: string;
  browser?: string;
  os?: string;
}

export interface RefreshToken {
  token: string;
  deviceInfo: DeviceInfo;
  createdAt: Date;
  expiresAt: Date;
  lastUsedAt?: Date;
  isActive: boolean;
}

export interface PreviousPassword {
  password: string;
  changedAt: Date;
}

export interface IAuth {
  _id: string;
  user: string;
  password: string;
  passwordChangedAt: Date;
  previousPasswords: PreviousPassword[];
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  emailVerificationAttempts: number;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordResetAttempts: number;
  refreshTokens: RefreshToken[];
  createdAt: Date;
  updatedAt: Date;
}
