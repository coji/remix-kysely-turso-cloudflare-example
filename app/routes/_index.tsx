import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { createDb } from '~/services/kysely.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    {
      name: 'description',
      content: 'Welcome to Remix! Using Vite and Cloudflare!',
    },
  ]
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const db = createDb(context.cloudflare.env)

  const posts = await db.selectFrom('posts').selectAll().limit(10).execute()
  return json({ posts })
}

export default function Index() {
  const { posts } = useLoaderData<typeof loader>()

  return (
    <div className="font-[system-ui,sans-serif] leading-8">
      <h1 className="text-2xl font-bold">
        Welcome to Remix (with Vite and Cloudflare)
      </h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
