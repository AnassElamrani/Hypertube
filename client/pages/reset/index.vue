<template>
  <resetBox ></resetBox>
</template>

<script>
import resetBox from "@/components/ResetPassword"

export default {
  layout:'auth',
  name: "ResetPassword",
  components: {
    resetBox,
  },
  head() {
    return {
      title: "Matcha - Reset Password",
    };
  }
}
</script>
<style>
</style>