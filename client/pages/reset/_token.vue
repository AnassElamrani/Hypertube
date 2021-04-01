<template>
<div>
  <changePassword v-if="show"></changePassword>
</div>
</template>

<script>
import changePassword from "@/components/ChangePassword"
export default {
  async beforeCreate() {
     const res = await this.$axios.$get(`/account/reset/${this.$route.params.token}`)
    if(res.error)
    { 
        this.$snoast.toast(this.$buefy,res.error,'is-danger')
        this.$router.push('/reset')
    }
    else 
      this.show = true
  },
  data(){
    return{
      show:false
    }
  },
  layout:'auth',
  name: "ChangePassword",
  components: {
    changePassword,
  }
}
</script>
<style>
</style>
