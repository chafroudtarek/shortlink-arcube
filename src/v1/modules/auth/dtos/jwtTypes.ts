interface IJWTPayload {
  iat: number;
  exp?: number;
}

export interface IJWTAcessPayload extends IJWTPayload {
  id: string;
  isVerified: boolean;
}
export interface IJWTRefreshPayload extends IJWTPayload {
  id: string;
  isVerified: boolean;
}

export interface IUserJWTTokens {
  accessToken: string;
  refreshToken: string;
}
