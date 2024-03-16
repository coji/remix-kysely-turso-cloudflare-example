import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/cloudflare'
import { Form, Link, redirect, useLoaderData } from '@remix-run/react'
import { PlusIcon } from 'lucide-react'
import { $path } from 'remix-routes'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { Button, Card, CardContent, CardHeader } from '~/components/ui'
import { dayjs } from '~/libs/dayjs'
import { createDb, type Clean, type Post } from '~/services/db.server'

export const loader = async ({
  request,
  params,
  context,
}: LoaderFunctionArgs) => {
  const db = createDb(context.cloudflare.env)
  const posts = await db.selectFrom('posts').selectAll().limit(10).execute()
  return json({ posts })
}

export const action = async ({ context }: ActionFunctionArgs) => {
  const db = createDb(context.cloudflare.env)
  const newPost = await db
    .insertInto('posts')
    .values({
      title: 'New Post',
      content: 'New Post Content',
      published_at: dayjs().toISOString(),
      created_at: dayjs().toISOString(),
      updated_at: dayjs().toISOString(),
    })
    .returning('id')
    .executeTakeFirst()
  if (!newPost) throw new Error('Failed to create a new post')

  return redirect($path('/posts/:id', { id: newPost.id }))
}

const PostCard = ({ handle, post }: { handle: string; post: Clean<Post> }) => {
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
  const { posts } = useLoaderData<typeof loader>()
  const handle = 'anonymous'

  return (
    <AppHeadingSection>
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
