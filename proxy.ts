import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isUsher = user?.user_metadata?.role === 'usher'

  const path = request.nextUrl.pathname
  const isAdminPath = path.startsWith('/admin')
  const isAdminLogin = path === '/admin/login'
  const isUsherPath = path.startsWith('/usher')
  const isUsherLogin = path === '/usher/login'

  // Admin dashboard: requires login, and usher accounts are not admins.
  if (isAdminPath && !isAdminLogin) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    if (isUsher) {
      const url = request.nextUrl.clone()
      url.pathname = '/usher'
      return NextResponse.redirect(url)
    }
  }

  if (isAdminLogin && user && !isUsher) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  // Door check-in: any authenticated account (admin or usher) can use it.
  if (isUsherPath && !isUsherLogin && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/usher/login'
    return NextResponse.redirect(url)
  }

  if (isUsherLogin && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/usher'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/usher/:path*'],
}
