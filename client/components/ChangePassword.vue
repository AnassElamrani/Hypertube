<template>
  <div>
    <div id="login-form" @keyup.enter="change">
      <b-field
        v-if="(status && isPass)"
        :label="$t('resetCmp.curpass')"
        v-bind:type="{ 'is-danger': errors.opassword }"
        v-bind:message="$t(errors.opassword)"
      >
        <b-input
          type="password"
          v-model="passwords.opassword"
          placeholder="********"
        ></b-input>
      </b-field>
      <b-field
        :label="$t('resetCmp.npass')"
        v-bind:type="{ 'is-danger': errors.npassword }"
        v-bind:message="$t(errors.npassword)"
      >
        <b-input
          type="password"
          v-model="passwords.npassword"
          placeholder="********"
        ></b-input>
      </b-field>
      <b-field
        :label="$t('resetCmp.cpass')"
        v-bind:type="{ 'is-danger': errors.cpassword }"
        v-bind:message="$t(errors.cpassword)"
      >
        <b-input
          type="password"
          v-model="passwords.cpassword"
          placeholder="********"
        ></b-input>
      </b-field>
      <b-button @click="change" type="is-primary"
        >{{$t('resetCmp.chpass')}}</b-button>
    </div>
    <div v-if="!status" id="buttom-links">
    {{$t('resetCmp.qst')}}&nbsp;
    <NuxtLink to="/">{{$t('resetCmp.red')}}</NuxtLink>
    </div>
  </div>
</template>

<script>

const validateOpassword = (opassword, status, isPass) => {
  if(status && isPass){
    if (!opassword)
      return { valid: false, error: "fError.emptyf" }
  }
  return { valid: true, error: null }
};

const validateNpassword = (npassword) => {
  if (!npassword )
    return { valid: false, error: "fError.emptyf" };
  if (!npassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[^A-Za-z0-9\s]).{8,}/))
    return {
      valid: false,
      error:
        "fError.passwderr",
    };
  return { valid: true, error: null };
};
const validateCpassword = (cpassword, npassword) => {
  if (cpassword !== npassword)
    return { valid: false, error: "fError.cpasswd" };
  return { valid: true, error: null };
};
export default {
  props:["isPass"],
  data() {
    return {
      status: this.$store.state.auth.loggedIn,
      passwords: {
        npassword: "",
        cpassword: "",
        opassword: "",
        token: this.$route.params.token
      },
      valid: true,
      errors: {}
    };
  },
  beforeDestroy() {
    if(this.status)
      this.$snoast.close()
  },
  methods: {
    async change() {
      this.valid = true
      this.errors= {}
      const validOpassword = validateOpassword(this.passwords.opassword, this.status, this.isPass);
      this.errors.opassword = validOpassword.error;
      if (this.valid) this.valid = validOpassword.valid;
      
      const validNpassword = validateNpassword(this.passwords.npassword);
      this.errors.npassword = validNpassword.error;
      if (this.valid) this.valid = validNpassword.valid;

      const validCpassword = validateCpassword(
        this.passwords.cpassword,
        this.passwords.npassword
      );
      this.errors.cpassword = validCpassword.error;
      if (this.valid) this.valid = validCpassword.valid;
      
      if (this.valid) {
        let res = null
        if (this.passwords.token)
          res = await this.$axios.$post("/account/change-password", this.passwords);
        else
          res = await this.$axios.$put("/account/change-password", this.passwords);
        if (res.passError){
            this.valid = false;
            this.errors.opassword = "The Current password is incorrect"
        }
        else{
          if (!res.error)
          {
            this.$snoast.toast(this.$buefy, res.message, 'is-success')
            if (this.passwords.token)
              this.$router.push('/')
          }
          else{
            this.$snoast.toast(this.$buefy, res.error, 'is-danger')
            if (this.passwords.token)
              this.$router.push('/reset')
          }
        }
      }
      this.passwords = {
        npassword: this.npassword,
        cpassword: this.cpassword,
        opassword: this.opassword,
        token: this.$route.params.token
      }

    }
  }
};
</script>

<style>
</style>