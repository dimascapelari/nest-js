import { registerAs } from '@nestjs/config';
import type { JwtSignOptions } from '@nestjs/jwt';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUER,
    // Em runtime o jsonwebtoken aceita "30d", "2h", número em segundos etc.
    // Mas process.env.JWT_TTL tem o tipo "string" (qualquer string), e o TS não
    // consegue provar que bate com o formato de duração. O cast afirma que é válido.
    jwtTtl: process.env.JWT_TTL as JwtSignOptions['expiresIn'],
  };
});
