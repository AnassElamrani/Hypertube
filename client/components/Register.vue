<template>
  <div>
    <div id="login-form" @keyup.enter="register">
      <div id="fname">
      <b-field label="" id="fname1"
        :type="{'is-danger': errors.fname}"
        :message="$t(errors.fname)"
        > 
        <b-input v-model="user.fname" :placeholder="$t('registerCmp.fname')" maxlength="25"></b-input>
      </b-field>
      <b-field label="" 
        :type="{'is-danger': errors.lname}"
        :message="$t(errors.lname)"
      >
        <b-input v-model="user.lname" :placeholder="$t('registerCmp.lname')" maxlength="25"></b-input>
      </b-field>
      </div>
      <b-field label="" 
        :type="{'is-danger': errors.email}"
        :message="$t(errors.email)"
        >
        <b-input v-model="user.email" :placeholder="$t('registerCmp.email')"></b-input>
      </b-field>
      <b-field label=""  
        :type="{'is-danger': errors.login}"
        :message="$t(errors.login)"
        >
        <b-input v-model="user.login" :placeholder="$t('registerCmp.username')"></b-input>
      </b-field>
      <b-field label="" 
        :type="{'is-danger': errors.password}"
        :message="$t(errors.password)"
        >
        <b-input
          type="password"
          v-model="user.password"
          :placeholder="$t('registerCmp.passwd')"
          password-reveal
        ></b-input>
      </b-field>
      <b-field label="" 
        :type="{'is-danger': errors.cpassword}"
        :message="$t(errors.cpassword)"
        >
        <b-input
          type="password"
          v-model="user.cpassword"
          :placeholder="$t('registerCmp.cpasswd')"
          password-reveal
        ></b-input>
      </b-field>
      <b-button @click="register" type="is-primary" expanded>{{$t('registerCmp.btn')}}</b-button>
    </div>
    <div id="buttom-links">{{$t('registerCmp.qst')}}&nbsp;
        <NuxtLink to="/">{{$t('registerCmp.red')}}</NuxtLink>
    </div>

  </div>
</template>

<script>
  const validateFname = (fname) => {
    if (!fname) return { valid: false, error: "fError.emptyf" };
    if (fname.length < 3)
      return {
        valid: false,
        error: "fError.fnerr1",
      };
    if (!fname.match(/^[a-zA-Z]+$/))
      return { valid: false, error: "fError.fnerr2" };
    return { valid: true, error: null };
  };
  const validateLname = (lname) => {
    if (!lname) return { valid: false, error: "fError.emptyf" };
    if (lname.length < 3)
      return {
        valid: false,
        error: "fError.lnerr1",
      };
    if (!lname.match(/^[a-zA-Z]+$/))
      return { valid: false, error: "fError.lnerr2" };
    return { valid: true, error: null };
  };
  const validateEmail = (email) => {
    if (!email) return { valid: false, error: "fError.emptyf" };
    if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    )
      return { valid: false, error: "fError.emailerr" };
    return { valid: true, error: null };
  };
  const validateLogin = (login) => {
    if (!login) return { valid: false, error: "fError.emptyf" };
    if (login.length > 14)
      return { valid: false, error: "fError.loginerr1" };
    if (!login.match(/^[a-zA-Z0-9]+$/))
      return { valid: false, error: "fError.loginerr2" };
    return { valid: true, error: null };
  };
  const validatePassword = (password) => {
    if (!password) return { valid: false, error: "fError.emptyf" };
    if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[^A-Za-z0-9\s]).{8,}/
      )
    )
      return {
        valid: false,
        error:
          "fError.passwderr",
      };
    return { valid: true, error: null };
  };
  const validateCpassword = (cpassword, password) => {
    if (cpassword !== password)
      return { valid: false, error: "fError.cpasswd" };
    return { valid: true, error: null };
  };
export default {
  data () {
    return {
      user: {
        fname: '',
        lname: '',
        email: '',
        login: '',
        password: '',
        cpassword: ''
      },
      valid: null,
      errors: {}
    }
  },
  methods: {
    async register () {
      this.errors = {}
      this.valid = true
      
      const validFname = validateFname(this.user.fname)
      this.errors.fname = validFname.error
      if (this.valid) this.valid = validFname.valid
      
      const validLname = validateLname(this.user.lname)
      this.errors.lname = validLname.error
      if (this.valid) this.valid = validLname.valid

      const validEmail = validateEmail(this.user.email)
      this.errors.email = validEmail.error
      if (this.valid) this.valid = validEmail.valid
      const validLogin = validateLogin(this.user.login)
      this.errors.login = validLogin.error
      if (this.valid) this.valid = validLogin.valid
      
      const validPassword = validatePassword(this.user.password)
      this.errors.password = validPassword.error
      if (this.valid) this.valid = validPassword.valid

      const validCpassword = validateCpassword(this.user.cpassword,this.user.password)
      this.errors.cpassword = validCpassword.error
      if (this.valid) this.valid = validCpassword.valid

      if (this.valid) {
        const response = await this.$axios.$post('/account/register', this.user)
        if(response.emailerr || response.loginerr){
          if(response.emailerr)
          {
              this.valid = false;
              this.errors.email = "This email already exists"
          }
          if(response.loginerr)
          {
              this.valid = false;
              this.errors.login = "This username already exists"
          }
        }
        else {
          if(response.error)
            this.$snoast.toast(this.$buefy, response.error, 'is-danger')
          else
          {
            this.$snoast.toast(this.$buefy, response.message, 'is-success')
            this.$router.push('/')
          }
        }
        this.user = {
          fname: this.user.fname,
          lname: this.user.lname,
          email: this.user.email,
          login: this.user.login,
          password: this.user.password,
          cpassword: this.user.cpassword
          }
      }
    },
    
        
      
    
        
     
  }
}
</script>

<style>
#fname{
  display: flex;
}
#fname1{
  margin-right: 10px;
}
#fname .counter{
  display: none;
}
#fname p{
  margin-bottom: 3px;
}
</style>