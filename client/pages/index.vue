<template>
  <div>
    <login></login>
  </div>

</template>

<script>
import login from "~/components/Login";

export default {
  layout: 'auth',
  name: "HomePage",
  components: {login}
};
</script>
<style>
</style>