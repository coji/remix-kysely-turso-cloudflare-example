import { LibsqlDiarect } from '@coji/kysely-libsql'
import { createClient } from '@libsql/client/web'
import { Kysely } from 'kysely'
import type { DB } from './types'

export const createDb = (env: Record<string, string>) => {
  return new Kysely<DB>({
    dialect: new LibsqlDiarect({
      client: createClient({
        url: env.TURSO_DATABASE_URL ?? 'http://localhost:8080',
        authToken: env.TURSO_AUTH_TOKEN,
      }),
    }),
  })
}
