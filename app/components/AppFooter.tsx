import { Link } from '@remix-run/react'
import { ExternalLinkIcon } from 'lucide-react'
import { $path } from 'remix-routes'
import { Avatar, AvatarImage } from './ui'

export const AppFooter = () => {
  const user = { handle: 'anonymous', photoURL: null }

  return (
    <div className="text-slate-00 bg-slate-50 py-14 text-sm">
      <div className="mx-auto flex w-full max-w-screen-md flex-col gap-11 px-4 sm:px-10 md:flex-row md:px-6">
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <Link
              className="flex items-center gap-2 hover:underline"
              to={$path('/', { handle: user.handle })}
            >
              <Avatar>
                <AvatarImage src={user.photoURL ?? undefined} />
              </Avatar>
              @{user.handle}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link className="hover:underline" to={$path('/')}>
            ホーム
          </Link>
          <Link
            className="hover:underline"
            target="_blank"
            rel="noreferrer"
            to="https://github.com/coji/remix-kysely-turso-cloudflare-example"
          >
            ソースコード
            <ExternalLinkIcon className="mb-1 ml-1 inline h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
