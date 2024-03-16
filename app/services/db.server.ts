import { LibsqlDiarect } from '@coji/kysely-libsql'
import { createClient } from '@libsql/client/web'
import { Kysely, type ColumnType } from 'kysely'
import type { DB, Post } from './types'
export type { DB, Post }

// Generated 型を外して扱いやすくする
export type Clean<T> = {
  [K in keyof T]-?: T[K] extends ColumnType<infer S> ? S : T[K]
}

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
