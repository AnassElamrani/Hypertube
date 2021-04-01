<template>
   <b-navbar id="thenav" :transparent="true">
        <template #brand>
            <b-navbar-item tag="router-link" :to="{path:'/'}">
                <img
                    src="@/assets/img/logo.png"
                    alt="logo hypertube"
                >
            </b-navbar-item>
        </template>
        <template #end>
            <b-navbar-item tag="router-link" :to="{path: '/profile'}">
                <i class="fas fa-user"></i> &nbsp; Profile
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{path: '/settings'}">
                <i class="fas fa-cog"></i> &nbsp;  Settings
            </b-navbar-item>
            <b-navbar-item @click="logout">
                <i class="fas fa-sign-out-alt"></i> &nbsp; Log out
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script>
export default {
    methods: {
    async logout()
    {
        const res = await this.$axios.get('/account/logout')
        if(res.error)
          this.$snoast.toast(this.$buefy, res.error, 'is-danger')
        else{
        //   this.$store.commit('auth/logOut')
          this.$router.go()
        }
    }
  },
}
</script>

<style>

#thenav{
    background-color: transparent;
}
.navbar-menu{
    background-color: #111111;
}
.navbar-item{
    font-weight: 400;
    color: #b0b3b8;
}

a.navbar-item:hover{
    background-color: #1e1e1e;
    /* text-shadow: 2px 2px 2px #3fc58e; */
}

</style>