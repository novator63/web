import dotenv from 'dotenv';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { getJwtSecret } from '@config/env.js';
import User from '@models/User.js';

dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: getJwtSecret(),
};

passport.use(
  new JwtStrategy(
    options,
    async (
      payload: { id: number },
      done: (error: Error | null, user: Express.User | false) => void,
    ) => {
      try {
        const user = await User.findByPk(payload.id);
        if (user) {
          return done(null, {
            id: user.id,
            email: user.email,
            name: user.name,
          });
        }
        return done(null, false);
      } catch (error) {
        return done(error as Error, false);
      }
    },
  ),
);

export default passport;
