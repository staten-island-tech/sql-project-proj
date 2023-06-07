<script setup>
import { supabase } from '../supabase'
import { onMounted, ref, toRefs } from 'vue'
import router from '../router/index.js'

const props = defineProps(['session'])
const { session } = toRefs(props)

const loading = ref(false)
const username = ref('')

 const redirect = () => {
  router.push('/Log')
}

async function signOut() {
  try {
    loading.value = true
    let { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
 
    <div>
        <h1>Log yo BOOKS >:(</h1>
      <button class="button block" @click="signOut" :disabled="loading">Sign Out</button>
    </div>

</template>