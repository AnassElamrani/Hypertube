<template>
  <div>
    <b-tabs type="is-boxed" v-model="active">
      <b-tab-item>
        <template #header>
          <b-icon icon="account"></b-icon>
          <span class="sttg-ttl">Profile</span>
        </template>
        <set-profile :user="user"></set-profile>
      </b-tab-item>
      <b-tab-item>
        <template #header>
          <b-icon icon="lock"></b-icon>
          <span class="sttg-ttl">Change Password</span>
        </template>
        <change-password :isPass="user.isPass"></change-password>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
export default {
  layout: "home",
  data() {
      return {
          active: 0,
      }
  },
  async asyncData({$axios}) {
      const res = await $axios.$get('/account/settings')
      return {user: res.user}
  }
};
</script>

<style lang="scss" scoped>
</style>