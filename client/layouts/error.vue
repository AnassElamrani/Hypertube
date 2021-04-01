<template>
  <div id="err-page">
    <!-- <img v-if="error.statusCode === 404" class="err-img" src="@/assets/error-404.svg">
    <img v-if="error.statusCode != 404" class="err-img" src="@/assets/warning.svg"> -->
    <br>
    <span v-if="error.statusCode === 404"  class="err-txt">Sorry, We couldn't find this page!</span>
    <span v-if="error.statusCode != 404"  class="err-txt">Something went wrong!</span>
    <br>
    <NuxtLink id="err-link" to="/">Go to the Home page &nbsp;<i class="fas fa-long-arrow-alt-right"></i></NuxtLink>

    
  </div>
</template>

<script>
  export default {
    props: ['error'],
    }
</script>
<style>
#err-page{
  text-align: center;
}
.err-img{
  margin-top: 100px;
  height: 50vh;
}
.err-txt{
  color: black;
  font-size: 1.5rem;
  font-weight: 600;
}
#err-link{
  color: #C3073F;
  font-weight: 500;
  font-size: 1.4rem;
}
#err-link:hover{
  color: #C3073F;
}
@media (max-width: 800px)
{
  .err-img{
  margin-top: 50px;
  height: 50vh;
  }
  #err-page{
  padding: 0px 30px;
  }
}
</style>