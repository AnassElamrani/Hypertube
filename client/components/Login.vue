<template>
  <div>
    <div id="login-form" @keyup.enter="login">
      <b-field
        :label="$t('loginCmp.login')"
        v-bind:type="{'is-danger': errors.login}"
        v-bind:message="$t(errors.login)"
      >
        <b-input v-model="user.login" :placeholder="$t('loginCmp.login_holder')"></b-input>
      </b-field>
      <b-field
        :label="$t('loginCmp.passwd')"
        v-bind:type="{'is-danger': errors.password}"
        v-bind:message="$t(errors.password)"
      >
        <b-input type="password" v-model="user.password" placeholder="********"></b-input>
      </b-field>
      <div id="f-pswd">
        <NuxtLink to="/reset">{{$t('loginCmp.passwd_fo')}}</NuxtLink>
      </div>
      <b-button @click="login" type="is-primary" expanded>{{$t('loginCmp.login_btn')}}</b-button>
        <authbtn></authbtn>
    </div>

    <div id="buttom-links">
      {{$t('loginCmp.no_account')}}&nbsp;
      <NuxtLink to="/register">{{$t('loginCmp.sign_up')}}</NuxtLink>
    </div>
  </div>
</template>

<script>
import authbtn from '@/components/AuthBtns.vue';

const validateLogin = login => {
  if (!login) return { valid: false, error: "fError.emptyf"};
  return { valid: true, error: null };
};
const validatePassword = password => {
  if (!password) return { valid: false, error: "fError.emptyf" };
  return { valid: true, error: null };
};
export default {
  beforeDestroy() {
    this.$snoast.close()
  },
  data() {
    return {
      user: {
        login: "",
        password: ""
      },
      valid: true,
      errors: {}
    };
  },
  components: {authbtn},
  methods: {
    async login() {
      this.errors = {};
      this.valid = true;

      const validLogin = validateLogin(this.user.login);
      this.errors.login = validLogin.error;
      if (this.valid) this.valid = validLogin.valid;

      const validPassword = validatePassword(this.user.password);
      this.errors.password = validPassword.error;
      if (this.valid) this.valid = validPassword.valid;

      if (this.valid) {
        const res = await this.$axios.$post("/account/login", this.user);
        if(res.error){
          if (res.special) this.$snoast.snackbar(this.$buefy,res.error,'is-danger','Verify Now','/verify')
          if (!res.special) this.$snoast.toast(this.$buefy, res.error, 'is-danger')
        }
        else this.$router.go()
      }
    }
  }
};
</script>

<style>
</style>