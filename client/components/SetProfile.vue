<template>
  <div>
    <input type="file" style="display: none" ref="upload" accept="image/*" @change="onFilePicked" />
    <div class="profile-picture" @click="$refs.upload.click()"> 
      <img
      id="prf-img"
        v-if="tmpUser.profile"
        :src="tmpUser.profile"
      />
      <i
        v-else
        class="fas fa-user-circle profile"
      ></i>
    </div>
    <b-field
      label="First Name"
      :type="{ 'is-danger': errors.fname }"
      :message="errors.fname"
    >
      <b-input v-model="tmpUser.fname" placeholder="First Name"></b-input>
    </b-field>
    <b-field
      label="Last Name"
      :type="{ 'is-danger': errors.lname }"
      :message="errors.lname"
    >
      <b-input v-model="tmpUser.lname" placeholder="Last Name"></b-input>
    </b-field>
    <b-field
      label="Email"
      :type="{ 'is-danger': errors.email }"
      :message="errors.email"
    >
      <b-input v-model="tmpUser.email" placeholder="Email"></b-input>
    </b-field>
    <b-field
      label="Username"
      :type="{ 'is-danger': errors.login }"
      :message="errors.login"
    >
      <b-input v-model="tmpUser.login" placeholder="Username"></b-input>
    </b-field>
    <b-button @click="edit" type="is-primary">Save</b-button>
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
  if (login.length > 25) return { valid: false, error: "fError.loginerr1" };
  if (!login.match(/^[a-zA-Z0-9]+$/))
    return { valid: false, error: "fError.loginerr2" };
  return { valid: true, error: null };
};
export default {
  data() {
    return {
      valid: null,
      errors: {},
      image: null,
      tmpUser: this.user
    };
  },
  
  props: ["user"],
  methods: {
    async edit() {
      this.errors = {};
      this.valid = true;

      const validFname = validateFname(this.tmpUser.fname);
      this.errors.fname = validFname.error;
      if (this.valid) this.valid = validFname.valid;

      const validLname = validateLname(this.tmpUser.lname);
      this.errors.lname = validLname.error;
      if (this.valid) this.valid = validLname.valid;

      const validEmail = validateEmail(this.tmpUser.email);
      this.errors.email = validEmail.error;
      if (this.valid) this.valid = validEmail.valid;
      const validLogin = validateLogin(this.tmpUser.login);
      this.errors.login = validLogin.error;
      if (this.valid) this.valid = validLogin.valid;

      if (this.valid) {
        const response = await this.$axios.$put("/account/settings", {user: this.tmpUser, image: !!this.image});

        if (response.emailerr) {
          this.valid = false;
          this.errors.email = "This email already exists";
        }
        if (response.loginerr) {
          this.valid = false;
          this.errors.login = "This username already exists";
        }
        if (response.status === 200)
          this.$snoast.toast(this.$buefy, "profile updated", "is-success");
        this.tmpUser = {
          fname: this.tmpUser.fname,
          lname: this.tmpUser.lname,
          email: this.tmpUser.email,
          login: this.tmpUser.login,
          profile: this.tmpUser.profile
        };
      }
    },
    onFilePicked(event) {
      const files = event.target.files;
      if (files.length && files[0].type.match('image.*')) {
        if(files[0].size < 2000000){
            const fileReader = new FileReader();
            fileReader.addEventListener("load", e => {
              this.image = new Image()          
              this.image.onload = () => {
                this.tmpUser.profile = e.target.result;
              }
              this.image.onerror = () => this.$snoast.toast(this.$buefy, "Please choose a valid image", 'is-danger')
              this.image.src = e.target.result
            });
            fileReader.readAsDataURL(event.target.files[0]);
        }
        else this.$snoast.toast(this.$buefy, "this file is large", 'is-danger')
      } 
      else {
        this.$snoast.toast(this.$buefy, "Please choose a valid image", 'is-danger')
        this.tmpUser.profile = null;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.profile {
  font-size: 80px;
}
.profile-picture{
    width: 80px;
    position: relative;
}
.profile-picture:hover{
    cursor: pointer;
}

.edit-profile{
    position: absolute;
    top: 30px;
    right: 30px;
}
#prf-img{
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}
</style>