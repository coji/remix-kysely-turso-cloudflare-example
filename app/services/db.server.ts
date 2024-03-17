import { LibsqlDiarect } from '@coji/kysely-libsql'
import { createClient } from '@libsql/client/web'
import {
  Kysely,
  type Insertable,
  type Selectable,
  type Updateable,
} from 'kysely'
import type { DB, Post } from './types'

type PostItem = Selectable<Post>
type PostInsert = Insertable<Post>
type PostUpdate = Updateable<Post>
export type { DB, PostInsert, PostItem, PostUpdate }

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
