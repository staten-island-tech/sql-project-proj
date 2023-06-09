<script setup>
const props = defineProps(['session'])
const { session } = toRefs(props)
import Account from '../components/Account.vue';
import { onMounted, ref, toRefs } from 'vue'

</script>

<template>
  <div class="container">
    <Account :session="session"></Account>
  </div>
</template>

<style>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

</style>


