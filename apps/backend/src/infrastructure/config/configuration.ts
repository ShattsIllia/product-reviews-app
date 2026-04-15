function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parseJwtExpiresIn(raw: string): string | number {
  const trimmed = raw.trim();
  if (/^\d+$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

export const configuration = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isDev = nodeEnv === 'development' || nodeEnv === 'test';
  const expiresIn = parseJwtExpiresIn(process.env.JWT_EXPIRES_IN || '15m');

  return {
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
      url: process.env.DATABASE_URL,
    },
    jwt: {
      secret: isDev ? process.env.JWT_SECRET || 'dev-secret-key' : requireEnv('JWT_SECRET'),
      expiresIn,
    },
    nodeEnv,
  };
};
