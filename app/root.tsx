import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from '@remix-run/cloudflare'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { useEffect } from 'react'
import { getToast } from 'remix-toast'
import { toast } from 'sonner'
import { Toaster } from '~/components/ui/sonner'
import tailwindcss from './tailwind.css?url'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindcss },
]

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request)
  return json({ toastData: toast }, { headers: headers ? headers : undefined })
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { toastData } = useLoaderData<typeof loader>()

  useEffect(() => {
    if (!toastData) return
    let toastFn = toast.info
    if (toastData.type === 'success') {
      toastFn = toast.success
    } else if (toastData.type === 'error') {
      toastFn = toast.error
    }
    const id = toastFn(toastData.message, {
      description: toastData.description,
    })
    return () => {
      toast.dismiss(id)
    }
  }, [toastData])

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Toaster />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
