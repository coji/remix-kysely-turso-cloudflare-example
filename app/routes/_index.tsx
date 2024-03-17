import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/cloudflare'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { PlusIcon } from 'lucide-react'
import { $path } from 'remix-routes'
import { redirectWithSuccess } from 'remix-toast'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { DurationBar } from '~/components/DurationBar'
import { Button, Card, CardContent, CardHeader } from '~/components/ui'
import { dayjs } from '~/libs/dayjs'
import { createDb, type Clean, type Post } from '~/services/db.server'

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const db = createDb(context.cloudflare.env)
  const start = Date.now()
  const posts = await db
    .selectFrom('posts')
    .selectAll()
    .orderBy('published_at', 'desc')
    .limit(100)
    .execute()
  const duration = Date.now() - start
  return json({ posts, duration })
}

export const action = async ({ context }: ActionFunctionArgs) => {
  const db = createDb(context.cloudflare.env)
  const start = Date.now()
  const newPost = await db
    .insertInto('posts')
    .values({
      title: 'New Post',
      content: 'New Post Content',
      created_at: dayjs().toISOString(),
      updated_at: dayjs().toISOString(),
    })
    .returning('id')
    .executeTakeFirst()
  const duration = Date.now() - start
  if (!newPost) throw new Error('Failed to create a new post')

  return redirectWithSuccess($path('/posts/:id', { id: newPost.id }), {
    message: 'New post created',
    description: `INSERT: ${duration}ms`,
  })
}

const PostCard = ({ post }: { handle: string; post: Clean<Post> }) => {
  return (
    <Card
      key={String(post.id)}
      className="relative rounded-xl border-none bg-slate-100"
    >
      <Link
        to={$path('/posts/:id', { id: String(post.id) })}
        className="absolute inset-0"
        prefetch="intent"
      >
        &nbsp;
      </Link>

      <CardHeader>
        <div className="mx-auto flex h-24 w-20 flex-col gap-[2px] overflow-clip bg-white p-[8px] shadow-md">
          <div className="text-[4px]">{post.title}</div>
          <div className="line-clamp-6 text-[2px]">{post.content}</div>
        </div>
      </CardHeader>
      <CardContent className="leading-loose">
        <div className="line-clamp-2">{post.title}</div>
        <div className="text-sm text-slate-400">
          {dayjs(post.published_at).format('YYYY/MM/DD')}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Index() {
  const { posts, duration } = useLoaderData<typeof loader>()
  const handle = 'anonymous'

  return (
    <AppHeadingSection>
      <DurationBar rows={posts.length} loader={duration} />
      <div className="flex">
        <h1 className="flex-1 text-2xl">{`@${handle}`}</h1>
        <Form method="POST">
          <Button variant="outline" className="rounded-full px-2" type="submit">
            <PlusIcon />
          </Button>
        </Form>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => (
          <PostCard key={post.id} handle={handle} post={post} />
        ))}
      </div>
    </AppHeadingSection>
  )
}
