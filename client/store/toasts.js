const state = () => ({
    fun: null,
    time: null
  })
  
const mutations = {
    add(state, arg) {
      const call = state.fun
      if (call)
      {
        call()
        state.fun = null
      }
      state.time = arg.time
      state.fun = arg.toast
    },
    clear(state) {
      const call = state.fun
      if (call)
      {
        call()
      }
    }
  }

export default{
  state,
  mutations
}