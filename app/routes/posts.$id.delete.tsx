import { json, type ActionFunctionArgs } from '@remix-run/cloudflare'
import { useFetcher } from '@remix-run/react'
import { $path } from 'remix-routes'
import { redirectWithSuccess } from 'remix-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  DropdownMenuItem,
} from '~/components/ui'
import { createDb, type PostItem } from '~/services/db.server'

export const action = async ({ params, context }: ActionFunctionArgs) => {
  const { id } = params
  if (!id) throw json({ message: 'Not found' }, { status: 404 })

  const db = createDb(context.cloudflare.env)
  const start = Date.now()
  const post = await db
    .deleteFrom('posts')
    .where('id', '==', id)
    .executeTakeFirst()
  const duration = Date.now() - start
  return redirectWithSuccess($path('/'), {
    message: '削除しました',
    description: `DELETE in ${duration}ms`,
  })
}

interface PostDeleteMenuItemProps {
  post: PostItem
  className?: string
  children: React.ReactNode
}
export const PostDeleteMenuItem = ({
  post,
  className,
  children,
}: PostDeleteMenuItemProps) => {
  const fetcher = useFetcher()

  return (
    <DropdownMenuItem
      onSelect={() => {
        fetcher.submit(
          {},
          {
            method: 'POST',
            action: $path('/posts/:id/delete', { id: post.id }),
          },
        )
      }}
      className={className}
    >
      {children}
    </DropdownMenuItem>
  )
}

interface DeleteAlertDialogProps {
  open: boolean
  post: PostItem
  onCanceled: () => void
}
export const DeleteAlertDialog = ({
  open,
  post,
  onCanceled,
}: DeleteAlertDialogProps) => {
  const fetcher = useFetcher()

  const handleClickDelete = () => {
    fetcher.submit(
      {},
      {
        method: 'POST',
        action: $path('/posts/:id/delete', { id: post.id }),
      },
    )
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>記事を削除します</AlertDialogTitle>
          <AlertDialogDescription>本当に削除しますか？</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onCanceled()}>
            キャンセル
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="submit"
              variant="destructive"
              onClick={() => handleClickDelete()}
            >
              削除
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function DeletePage() {
  return <div />
}
