<template>
  <div class="container">
    <h1>Book Log</h1>
    <form @submit.prevent="bookStore.submit" class="form">
      <div class="form-group">
        <label class="form-label">Author:</label>
        <input class="form-input" type="text" placeholder="Enter author" v-model="bookStore.author" required />
      </div>
      <div class="form-group">
        <label class="form-label">Title of Book:</label>
        <input class="form-input" type="text" placeholder="Enter title" v-model="bookStore.title" required />
      </div>
      <div class="form-group">
        <label class="form-label">Rating:</label>
        <input class="form-input" type="text" placeholder="Enter rating" v-model="bookStore.rating" required />
      </div>
      <button type="submit" class="button">Submit</button>
    </form>

    <div class="card-list" v-if="bookStore.showOutput">
      <div v-for="(card, index) in bookStore.cards" :key="index" class="card">
        <div v-for="(value, inputIndex) in card" :key="inputIndex">
          <span v-if="inputIndex === 0">Author:</span>
          <span v-else-if="inputIndex === 1">Title of Book:</span>
          <span v-else-if="inputIndex === 2">Rating:</span>
          {{ value }}<br />
        </div>
        <button @click="bookStore.removeCard(index)" class="button">Remove</button>
      </div>
    </div>

    <div>
      <button class="button block" @click="bookStore.signOut" :disabled="bookStore.loading">Sign Out</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createPinia, defineStore } from 'pinia';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://uxufjlzukuzxdfnggdtd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4dWZqbHp1a3V6eGRmbmdnZHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU2NTA2MjMsImV4cCI6MjAwMTIyNjYyM30.cHcOH7-bYmuCA4cNZSFNhW88-XjH1E64_wwAO2yZdmQ';
const supabase = createClient(supabaseUrl, supabaseKey);

// Define Pinia store
const pinia = createPinia();

const useBookStore = defineStore('bookStore', {
  state: () => ({
    loading: false,
    showOutput: false,
    author: '',
    title: '',
    rating: '',
    cards: [],
  }),
  actions: {
    validateInputs() {
      if (!this.author || !this.title || !this.rating) {
        alert('Please fill in all required fields.');
        return false;
      }
      return true;
    },
    resetInputs() {
      this.author = '';
      this.title = '';
      this.rating = '';
    },
    async submit() {
      if (this.validateInputs()) {
        const values = [
          this.author.trim(),
          this.title.trim(),
          this.rating.trim(),
        ];

        // Insert values into the Supabase table
        try {
          const { data, error } = await supabase.from('bookLog').insert([
            { author: values[0], title: values[1], rating: values[2] },
          ]);
          if (error) {
            throw error;
          }

          this.cards.push(values);
          this.showOutput = true;
          this.resetInputs();

          localStorage.setItem('submittedValues', JSON.stringify(this.cards));
        } catch (error) {
          console.error('Error inserting values:', error.message);
        }
      }
    },
    removeCard(index) {
      this.cards.splice(index, 1);

      localStorage.setItem('submittedValues', JSON.stringify(this.cards));
    },
    async signOut() {
      try {
        this.loading = true;
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        this.loading = false;
      }
    },
  },
});

const bookStore = useBookStore();

onMounted(() => {
  const storedValues = localStorage.getItem('submittedValues');
  if (storedValues) {
    bookStore.cards = JSON.parse(storedValues);
    bookStore.showOutput = true;
  }
});
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 10px;
}

.form-label {
  display: block;
}

.form-input {
  width: 100%;
  padding: 8px;
  font-size: 14px;
}

.button {
  padding: 8px 12px;
  font-size: 14px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  margin-bottom: 10px;
}

.button.block {
  display: block;
  width: 100%;
}

.card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

.card-list {
  margin-top: 20px;
}
</style>



<!-- 
const supabaseUrl = 'https://uxufjlzukuzxdfnggdtd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4dWZqbHp1a3V6eGRmbmdnZHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU2NTA2MjMsImV4cCI6MjAwMTIyNjYyM30.cHcOH7-bYmuCA4cNZSFNhW88-XjH1E64_wwAO2yZdmQ';
const supabase = createClient(supabaseUrl, supabaseKey); -->
