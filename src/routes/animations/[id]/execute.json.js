import { client } from '$lib/db'
import * as commands from '$lib/commands'

export async function post(req) {
  const supabase = client(req.headers.authorization)

  const { id } = req.params
  const { name, command: commandName, args } = req.body
  const command = commands[commandName]

  if (!command) {
    return {
      status: 406,
      body: `Unknown command ${commandName}`
    }
  }

  const { data: animation, error } = await supabase
    .from('animations')
    .select('*')
    .match({id})
    .single()

  if (error || animation == null) {
    return {
      status: 404,
      body: 'Animation not found'
    }
  }

  const {state: updated, previous} = command.execute(animation, args)
  updated.pointer = animation.pointer + 1

  const { data: returnedData } = await supabase
    .from('animations')
    .update(updated, {returning: 'representation'})
    .match({id})

  await supabase
    .from('animation_commands')
    .delete()
    .eq('animation_id', id)
    .gte('pointer', animation.pointer)

  await supabase
    .from('animation_commands')
    .insert({
      animation_id: id,
      user_id: animation.user_id, // not needed once policy is setup
      counter: animation.pointer+1,
      type: commandName,
      args,
      previous
    })

  return {
    status: 200,
    body: JSON.stringify(returnedData)
  }
}
