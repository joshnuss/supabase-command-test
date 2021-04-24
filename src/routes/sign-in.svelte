<script>
  import { supabase } from '$lib/db'
  import Auth from 'supabase-ui-svelte'
</script>

<Auth supabaseClient={supabase}/>
