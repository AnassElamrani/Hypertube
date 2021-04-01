<template>
  <div class="visitorpage">
        <div  class="welcome-msg">
          <div id="black-shadow">
            <div class="the-msg">
                <span id="msg-txt">
                   {{$t('msg_txt')}}
                </span>
                <br>
                <div id="s-txt">{{$t('msg_slo')}}</div>
            </div>
          </div>
        </div>
        <div class="action-box">
            <img id="flag" :src='"@/assets/img/"+[$i18n.locale==="en"? "fr": "en"]+".svg"' @click="swicthLocale">
            <div class="the-box">
                <div id="blogo-container"><img id="blogo" src="~/assets/img/logo.png" /></div>
                <nuxt />
            </div>
        </div>
</div>
</template>

<script>

export default {
middleware: 'outauth',
head() {
    return {
      title: "Hypertube",
    };
  },
  methods:{
    swicthLocale()
    {
      this.$i18n.setLocale(this.$i18n.locale === "en"? "fr": "en")
    }
  }
}
</script>
<style src="@/assets/css/auth.css">

</style>
