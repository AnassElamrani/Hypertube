<template>
  <div class="the-box">
    <div id="login-form" @keyup.enter="sendEmail">
      <b-field
        :label="$t('resetCmp.login')"
        v-bind:type="{ 'is-danger': errorLogin }"
        v-bind:message="$t(errorLogin)"
      >
        <b-input
          v-model="user.login"
          :placeholder="$t('resetCmp.login_holder')"
        ></b-input>
      </b-field>
      <b-button @click="sendEmail" type="is-primary" expanded
        >{{$t('resetCmp.btn')}}</b-button
      >
    </div>
    <div id="buttom-links">
    {{$t('resetCmp.qst2')}}&nbsp;
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
      user: {
        login: "",
      },
      valid: true,
      errorLogin: "",
    };
  },
  methods: {
    async sendEmail() {
      this.errorLogin = "";
      this.valid = true;

      const validLogin = validateLogin(this.user.login);
      this.errorLogin = validLogin.error;
      if (this.valid) this.valid = validLogin.valid;

      if (this.valid) {
        const res = await this.$axios.$post("/account/verify", this.user);
        if(res.redirect) this.$router.push('/')
        if (res.error) this.$snoast.toast(this.$buefy, res.error, 'is-danger')
        else this.$snoast.toast(this.$buefy, res.message, 'is-success')
      }
    }
  }
};
</script>

<style>
</style>