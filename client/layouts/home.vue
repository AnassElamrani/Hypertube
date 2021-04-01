<template>
    <div>
        <div class="container hdr">
        <thenav/>
        </div>
        <div class="main">
            <div class="container cnt">
                <nuxt id="content"/>
            </div>
        </div>
        <footer class="container ftr">
            &#169; Hypertube 2021 - Made with &nbsp;<i class="fas fa-heart" id="heart"></i>&nbsp; by The Elite Team
        </footer>
    </div>
</template>

<script>
import Thenav from '../components/Thenav.vue'

export default {
  components: { Thenav },
   middleware: 'inauth',
}
</script>

<style lang="scss" scoped>
.hdr{
    // background-color: red;
    height: 60px;
}
.main{
    min-height: calc(100vh - 146px);
}
.ftr{
    padding-top: 20px;
    height: 60px;
    text-align: center;
    color: #b0b3b8;
}
#heart{
    color: #3fc58e;
}
.cnt{
    padding: 50px 30px;
}

</style>