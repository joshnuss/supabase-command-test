import { createClient } from '@supabase/supabase-js'
import { readable } from 'svelte/store'

export const supabase = client()

export function client(accessToken = null) {
  const headers = accessToken ? {authorization: accessToken} : {}

  return createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {headers}
  )
}

export const user = readable(supabase.auth.user(), set => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event == 'SIGNED_OUT') {
      set(null)
    } else if (event == 'SIGNED_IN') {
      set(supabase.auth.user())
    }
  })
})
