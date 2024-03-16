import { LibsqlDiarect } from '@coji/kysely-libsql'
import { createClient } from '@libsql/client/web'
import { Kysely } from 'kysely'
import type { DB } from './types'

export const kysely = new Kysely<DB>({
  dialect: new LibsqlDiarect({
    client: createClient({
      url: ':memory:',
    }),
  }),
})
