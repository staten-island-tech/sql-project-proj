<script setup>
const props = defineProps(['session'])
const { session } = toRefs(props)
import Account from '../components/Account.vue';
import { onMounted, ref, toRefs } from 'vue'

</script>

<template>
  <div>
    <Account :session="session"></Account>
  </div>
</template>
