import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/cloudflare'
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react'
import { ArrowLeftIcon } from 'lucide-react'
import { $path } from 'remix-routes'
import { redirectWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { Button, Input, Label, Textarea } from '~/components/ui'
import { createDb } from '~/services/db.server'

const schema = z.object({
  title: z
    .string({ required_error: '必須です' })
    .max(60, 'タイトルは60字までです。'),
  content: z
    .string({ required_error: '必須です' })
    .max(14000, '最大文字数に達しました 14000 / 14000 字'),
})

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const { id } = params
  if (!id) throw json({ message: 'Not found', status: 404 })

  const db = createDb(context.cloudflare.env)

  const post = await db
    .selectFrom('posts')
    .selectAll()
    .where('id', '==', id)
    .executeTakeFirst()
  if (!post) throw json({ message: 'Not found', status: 404 })
  return { id, post }
}

export const action = async ({
  request,
  params,
  context,
}: ActionFunctionArgs) => {
  const { id } = params
  if (!id) throw json({ message: 'Not found', status: 404 })

  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema })
  if (submission.status !== 'success') {
    return submission.reply()
  }

  // 更新
  const db = createDb(context.cloudflare.env)
  const start = Date.now()
  const post = await db
    .updateTable('posts')
    .where('id', '==', id)
    .set({
      title: submission.value.title,
      content: submission.value.content,
      published_at: new Date().toISOString(),
    })
    .returning('title')
    .executeTakeFirstOrThrow()
  const duration = Date.now() - start

  return redirectWithSuccess($path('/posts/:id', { id }), {
    message: '記事を更新しました',
    description: `UPDATE: ${duration}ms`,
  })
}

export default function PostEditPage() {
  const { id, post } = useLoaderData<typeof loader>()
  const lastResult = useActionData<typeof action>()

  const [form, { title, content }] = useForm({
    id: 'post-edit',
    defaultValue: {
      title: post.title,
      content: post.content,
    },
    lastResult,
    shouldValidate: 'onInput',
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  return (
    <div className="relative">
      <nav className="sticky top-0 flex flex-row gap-4 px-4 py-2 sm:justify-between">
        {post.published_at ? (
          <Button variant="ghost" size="sm" className="rounded-full" asChild>
            <Link to={$path('/posts/:id', { id })} prefetch="intent">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Form method="POST">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              name="intent"
              value="delete"
              type="submit"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Form>
        )}

        <Button
          className="rounded-full transition-all"
          type="submit"
          size="sm"
          form={form.id}
        >
          更新する
        </Button>

        <div />
      </nav>

      <Form
        method="POST"
        className="flex flex-col gap-4"
        {...getFormProps(form)}
      >
        <AppHeadingSection>
          <fieldset>
            <Label htmlFor={title.id}>タイトル</Label>
            <Input {...getInputProps(title, { type: 'text' })} />
            <div className="text-destructive">{title.errors}</div>
          </fieldset>

          <fieldset>
            <Label htmlFor={content.id}>本文</Label>
            <Textarea {...getTextareaProps(content)} />

            <div className="text-destructive">{content.errors}</div>
          </fieldset>
        </AppHeadingSection>
      </Form>
    </div>
  )
}
