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

function makeCard(){

}
</script>

<template>
 
    <div>
        <h1>Log yo BOOKS >:(</h1>
        <h1>Build a Cookie(:!</h1>
    <section class="form-parent">
        <form id="form">
            <div class="form-input">
                <div class="form-input">
                    <label for="texture">Texture of Cookie</label>
                    <input type="text" id="input1" class="text-box" required>
                </div>
                <div class="form-input">
                    <label for="extra">Topping</label>
                    <input type="text" id="input2" class="text-box" required>
                </div>
                <div class="type">
                    <label for="real/fake">Base Flavor</label>
                    <input type="text" id="input3" class="text-box" required>
                </div>
            </div>
            <div class="hero-form-input">
                <input type="submit" value="Submit" id="btn">
            </div>
        </form>
    </section>


      <button class="button block" @click="signOut" :disabled="loading">Sign Out</button>
    </div>

</template>