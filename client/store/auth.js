const state = ()=> ({
    loggedIn: false,
})
const mutations = {
    logIn(state){
        state.loggedIn = true
    },
    logOut(state){
        state.loggedIn = false
    }
}

export default {
    state,
    mutations
}