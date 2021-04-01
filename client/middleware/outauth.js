export default async function({store,$axios, redirect}){
    const ret = await $axios.post('/account/authorization');
    if(ret.data.state == 'AUTHORIZED')
    {
        store.commit('auth/logIn')
        redirect('/home')
    }
    else{
        store.commit('auth/logOut')
    }
}