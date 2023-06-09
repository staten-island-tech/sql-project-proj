<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const loading = ref(false)
const email = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
    })
    if (error) throw error
    alert('Check your email for the login link!')
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="page">
    <form class="row flex-center flex" @submit.prevent="handleLogin">
      <div class="form-widget">
        <h1 class="header">Log Your Book!</h1>
        <p class="description">Sign in via magic link with your email below</p>
        <div class="form-group">
          <input class="inputField" required type="email" placeholder="Your email" v-model="email" />
        </div>
        <div>
          <input
            type="submit"
            class="button block"
            :value="loading ? 'Loading' : 'Send magic link'"
            :disabled="loading"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<style>
body {
  background-color: #f5f5f5;
}

.page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.row {
  display: flex;
}

.flex {
  flex: 1;
}

.flex-center {
  justify-content: center;
  align-items: center;
}

.form-widget {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
  font-size: 24px;
  margin-bottom: 10px;
}

.description {
  font-size: 14px;
  color: #777;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.inputField {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.button.block {
  display: block;
  margin-top: 10px;
  width: 100%;
}

.button:disabled {
  background-color: #ccc;
}
</style>
