<template>
  <div>
    <div id="login-form" @keyup.enter="sendEmail">
      <b-field
        :label="$t('resetCmp.login')"
        v-bind:type="{ 'is-danger': errorLogin }"
        v-bind:message="$t(errorLogin)"
      >
        <b-input
          v-model="username.login"
          :placeholder="$t('resetCmp.login_holder')"
        ></b-input>
      </b-field>
      <b-button @click="sendEmail" type="is-primary" expanded
        >{{$t('resetCmp.btn')}}</b-button
      >
    </div>
    <div id="buttom-links">
    {{$t('resetCmp.qst')}}&nbsp;
    <NuxtLink to="/">{{$t('resetCmp.red')}}</NuxtLink>
    </div>
  </div>
</template>

<script>
const validateLogin = (login) => {
  if (!login) return { valid: false, error: "fError.emptyf" };
  return { valid: true, error: null };
};
export default {
  data({$config}) {
    return {
      link: $config.clientURL,
      username: {
        login: "",
      },
      valid: true,
      errorLogin: "",
    };
  },
  destroyed(){
    this.$snoast.close()
  },
  methods: {
    async sendEmail() {
      this.errorLogin = "";
      this.valid = true;

      const validLogin = validateLogin(this.username.login);
      this.errorLogin = validLogin.error;
      if (this.valid) this.valid = validLogin.valid;

      if (this.valid) {
        const res = await this.$axios.$post("/account/reset", this.username);
        if (res.error) {
            if (res.special) this.$snoast.snackbar(this.$buefy,res.error,'is-danger','Request a Verification Link','/verify')
            else this.$snoast.toast(this.$buefy, res.error, 'is-danger')
        }
        else this.$snoast.toast(this.$buefy, res.message, 'is-success')
      }
    }
  }
};
</script>

<style>
</style>