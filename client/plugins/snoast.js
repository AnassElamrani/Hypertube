export default ({store, redirect}, inject) => {
    const toast = (buefy, msg, type) =>{
        if(Date.now() - store.state.toasts.time > 250 && process.client)
            {
            const ref = buefy.toast.open({
                duration: 7000,
                message: msg,
                type: type,
            });
            
            const toast = ref.close
            const time = Date.now()
            store.commit('toasts/add', {toast, time})
            }
        }
    const snackbar = (buefy,msg,type,actionText, path ) => {
        if(Date.now() - store.state.toasts.time > 250 && process.client)
        {
            const ref = buefy.snackbar.open({
                message: msg,
                type,
                position: 'is-top',
                actionText,
                indefinite: true,
                queue: true,
                onAction: () => redirect(path)
            })
            const snackbar = ref.close
            const time = Date.now()
            store.commit('toasts/add', {toast: snackbar, time})
        }
    }
    const close = ()=>{
        store.commit('toasts/clear')
    }
    
    inject('snoast', {toast, close, snackbar})
  }