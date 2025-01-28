export const JWT_CONFIG = {
  secretKey: process.env?.JWT_SECRET_KEY?.replace(/\\n/g, '\n'),
  publicKey: process.env?.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n'),
  accessExpiresIn: process.env?.JWT_ACCESS_EXPIRES_AFTER,
  refreshExpiresIn: process.env?.JWT_REFRESH_EXPIRES_AFTER,
  refreshCookieName: process.env?.JWT_REFRESH_COOKIE_NAME,
};
