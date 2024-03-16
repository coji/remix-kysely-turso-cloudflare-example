import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { Link, useLoaderData } from '@remix-run/react'
import { ArrowLeftIcon, PencilIcon } from 'lucide-react'
import { $path } from 'remix-routes'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { Button } from '~/components/ui'
import { dayjs } from '~/libs/dayjs'
import { createDb } from '~/services/db.server'

export const loader = async ({
  request,
  params,
  context,
}: LoaderFunctionArgs) => {
  const { id } = params
  if (!id) throw new Error('Not found')

  const db = createDb(context.cloudflare.env)
  const post = await db
    .selectFrom('posts')
    .selectAll()
    .where('id', '==', id)
    .executeTakeFirst()
  if (!post) throw new Error('Not found')

  return json({ id, post })
}

export default function PostPage() {
  const { id, post } = useLoaderData<typeof loader>()
  return (
    <div>
      <nav className="flex px-4 py-2">
        <Button variant="ghost" size="sm" className="rounded-full" asChild>
          <Link to={$path('/')} prefetch="intent">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>

        <div className="flex-1" />

        <Button size="sm" variant="ghost" asChild>
          <Link to={$path('/posts/:id/edit', { id })} prefetch="intent">
            <PencilIcon className="mr-2 h-4 w-4" />
            記事を編集
          </Link>
        </Button>
      </nav>

      <AppHeadingSection>
        <h1 className="text-2xl leading-loose tracking-wider">{post.title}</h1>

        <div className="flex items-center gap-1 text-slate-500">
          <div>
            <Link to={$path('/')}>Top</Link>
          </div>
          <div>·</div>
          <div>{dayjs(post.published_at).format('YYYY/MM/DD')}</div>
        </div>

        <div className="leading-loose tracking-wider">{post.content}</div>
      </AppHeadingSection>
    </div>
  )
}
