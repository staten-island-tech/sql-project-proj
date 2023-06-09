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

onMounted(() => {
  getProfile()
})
async function getProfile() {
  try {
    loading.value = true
    const { user } = session.value

    let { data, error, status } = await supabase
      .from('profiles')
      .select(`username`)
      .eq('id', user.id)
      .single()

    if (error && status !== 406) throw error

    if (data) {
      username.value = data.username

    }
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

async function updateProfile() {
  try {
    loading.value = true
    const { user } = session.value

    const updates = {
      id: user.id,
      username: username.value,
      updated_at: new Date(),
    }

    let { error } = await supabase.from('profiles').upsert(updates)

    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
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
  <div class="container">
    <form class="form-widget" @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" type="text" :value="session.user.email" disabled />
      </div>
      <div class="form-group">
        <label for="username">Username:</label>
        <input id="username" type="text" v-model="username" />
      </div>
      <div>
        <input
          type="submit"
          class="button primary"
          :value="loading ? 'Loading ...' : 'Update'"
          :disabled="loading"
        />
      </div>
      <div>
        <button class="button" @click="signOut" :disabled="loading">Sign Out</button>
      </div>
    </form>
    <div>
      <RouterLink to="/Log">
        <button class="button">Go to Logging Page</button>
      </RouterLink>
    </div>
  </div>
</template>

<style>
.container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

button {
  display: inline-block;
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.button.primary {
  background-color: #28a745;
}

.button.block {
  display: block;
  width: 100%;
  margin-top: 10px;
}
</style>
