import { betterAuth } from "better-auth";
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { openAPI } from 'better-auth/plugins'
import { db } from "./db/client";

export const auth = betterAuth({
  basePath: '/auth',
  plugins:[openAPI()],
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    camelCase: false,

  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    password: {
      hash: (password: string) => Bun.password.hash(password),
      verify: ({password, hash}) => Bun.password.verify(password, hash)
    }
  },
  session: {
    expiresIn: 60 *60 *24 *7,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    }
  }
  // Descomentar quando trocar a tipagem do id nos schemas
  // para usar id: uuid("id").primaryKey().$defaultFn(() => randomUUIDv7())
  //
  // advanced: {
  //   database: {
  //     generateId: false
  //   },
  // }
});
