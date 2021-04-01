<template>
  <div>
    <login></login>
  </div>
</template>

<script>
import login from "@/components/Login";
export default {
  mounted() {
    this.checkToken();
  },
  methods: {
    async checkToken() {
      const res = await this.$axios.$get(
        `/account/verify/${this.$route.params.token}`
      );
      if (!res.error)
        this.$snoast.toast(this.$buefy, res.message, "is-success");
      else{
        if (res.special)
          this.$snoast.snackbar(this.$buefy,res.error,'is-danger','Verify Now','/verify')
        else
          this.$snoast.toast(this.$buefy, res.error, 'is-danger')
      }
    }
  },
  layout: "auth",
  components: {
    login
  }
};
</script>

<style>
</style>