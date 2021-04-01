<template>
  
  <b-loading :is-full-page="true" v-model="isLoading"></b-loading>

</template>

<script>
export default {
  data() {
            return {
                isLoading: true,
            }
  },
 async mounted(){
   if(this.$route.params.authsrc == '42' && this.$route.query.code)
    {
      const res = await this.$axios.$post('/account/oauth/42', {code : this.$route.query.code})
      if(!res.error)
      {
        this.$store.commit('auth/logIn', true)
        this.$router.push('/')
      }
      else
      {
        this.$router.push('/')
        this.$snoast.toast(this.$buefy, res.error, 'is-danger')
      }
    }
    else if(this.$route.params.authsrc == 'facebook' && this.$route.query.code)
    {
      const res = await this.$axios.$post('/account/oauth/facebook', {code : this.$route.query.code})
      if(!res.error)
      {
        this.$store.commit('auth/logIn', true)
        this.$router.push('/')
      }
      else
      {
        this.$router.push('/')
        this.$snoast.toast(this.$buefy, res.error, 'is-danger')
      }
    }
    else{
      this.$router.push('/')
    }

  }
}
</script>

<style>
</style>