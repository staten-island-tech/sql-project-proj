<template>
    <div class="cards">
        <img class="card-img" v-bind:src='image' alt="">
        <h1 class="card-Title">{{Title}}</h1>
        <p class="card-description">{{description}}</p>
        <div class="card-line">
            <h3 class="card-cost">${{cost}}.00</h3>
        </div>
        </div>
</template>

<script>
  
export default {
        name: "Card",
        props:{
            Title:String,
       image:String,
       cost: String,
       description: String,
       

        },
      };
    ;
</script>

<style >

</style>
