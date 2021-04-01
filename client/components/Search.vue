<template>
    <div id="srch-cnt">
      <div id="top-srch">
        <b-field >
        <b-input v-model="params.query_term" placeholder="Search" @keyup.native="typed" @keyup.native.enter="$emit('search', params)"></b-input>
      </b-field>
      <b-field >
            <b-select placeholder="Select a genre" v-model="params.genre">
                <option
                    v-for="(option, i) in options"
                    :value="option"
                    :key="i">
                    {{ option }}
                </option>
            </b-select>
        </b-field>
        </div>
        <div style="text-align: center;">
         <section id="genre-box">
        <div class="block">
            <b-radio v-model="params.sort_by"
                name="name"
                native-value="download_count">
                Downlaods
            </b-radio>
            <b-radio v-model="params.sort_by"
                name="name"
                native-value="rating">
                Rating
            </b-radio>
            <b-radio v-model="params.sort_by"
                name="name"
                native-value="year">
                Year
            </b-radio>
            <b-radio v-model="params.sort_by"
                name="name"
                native-value="title">
                Title
            </b-radio>
        <i v-if="params.order_by === 'desc'" class="fas fa-sort-amount-down order-ico" @click="changeOrder"></i>
        <i v-else class="fas fa-sort-amount-up order-ico" @click="changeOrder"></i>
        </div>
    </section>
        <b-button class="srch-btns" type="is-primary" @click="$emit('search', params)" >Apply Filters</b-button>
      <b-button class="srch-btns" @click="$emit('reset')" type="is-primary" :disabled="!resetb">Reset</b-button>
        </div>
    </div>
</template>

<script>
export default {
  props: ['resetb'],
  data() {
  return {
    changed: false,
    options: ['Select a genre',"COMEDY","DRAMA","HORROR","ANIMATION","ROMANCE","FANTASY","THRILLER","ACTION","ADVENTURE","CRIME"],
    params: {
      limit: 20,
      page: 1,
      quality: "",
      minimum_rating: "",
      query_term: "",
      genre: null,
      sort_by: "download_count",
      order_by: "desc",
    },
  };
},
  watch: {
    resetb: function(val){
      if(!val){
        this.params.query_term = ""
        this.params.genre = null
        this.params.sort_by = "download_count"
        this.params.order_by = "desc"
      }
    }
  },
  methods: {
    typed(){
      if(this.params.query_term.trim())
        this.params.sort_by = "title"
      else
        this.params.sort_by = "download_count"
    },
    changeOrder()
    {
      this.params.order_by = this.params.order_by === "desc"? "asc":"desc"
    }
  }
}
</script>

<style lang="scss" scoped>
#srch-cnt{
  width: 80%;
  margin: 0px auto 50px;
}
.order-ico{
  color: #3fc58e;
  font-size: 20px;
}
.order-ico:hover{
  color: #2a7b59;
  cursor: pointer;
}
#top-srch{
  // background-color: red;
  max-width: 500px;
  margin: auto;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: flex-start;
}
#genre-box{
  margin: 20px 0px;
}
.srch-btns{
  margin: 10px;
}
</style>