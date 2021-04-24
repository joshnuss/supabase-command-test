<script>
  import { supabase, user } from '$lib/db'

  const id = 5
  let data = {}

  async function run() {
    data = await post('execute.json', {
      command: 'increment',
      args: 2
    })
  }

  async function undo() {
    data = await post('undo.json')
  }

  async function redo() {
    data = await post('redo.json')
  }

  async function post(path, body = {}) {
    const accessToken = supabase.auth.session().access_token

    const response = await fetch(`/animations/${id}/${path}`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    return await response.json()
  }
</script>

<h1>Welcome to SvelteKit</h1>

{#if $user}
  You are signed in as: {$user.email}

  <pre>{JSON.stringify(data, null, 2)}</pre>

  <button on:click={run}>Run command</button>
  <button on:click={undo}>Undo</button>
  <button on:click={redo}>Redo</button>
{:else}
  <a href="/sign-in">Sign in</a>
{/if}
