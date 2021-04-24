export default {
  execute(state, args) {
    return { state: {data: {foo: state.data.foo + args}}, previous: {bla: 1} }
  },
  undo(state, args) {
    return { data: {foo: state.data.foo - args} }
  }
}
