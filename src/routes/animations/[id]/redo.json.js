import { client } from '$lib/db'
import * as commands from '$lib/commands'

export async function post(req) {
  const supabase = client(req.headers.authorization)
  const { id } = req.params
  const { data: animation } = await supabase
    .from('animations')
    .select('*')
    .match({id})
    .single()

  if (animation == null) {
    return {
      status: 404,
      body: 'Animation not found'
    }
  }

  const { data: log } = await supabase
    .from('animation_commands')
    .select('*')
    .match({animation_id: id})
    .order('counter', { ascending: false })
    .limit(1)
    .single()

  if (animation.pointer == log.counter) {
    return {
      status: 406,
      body: 'There are no changes to redo.'
    }
  }

  const command = commands[log.type]
  const { state: updated } = command.execute(animation, log.args)
  updated.pointer = animation.pointer + 1

  const { data: returnedData } = await supabase
    .from('animations')
    .update(updated, { returning: 'representation' })
    .match({id})

  return {
    status: 200,
    body: JSON.stringify(returnedData)
  }
}

