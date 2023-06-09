<template>
  <div class="container">
    <h1>Book Log</h1>
    <form @submit.prevent="submit" class="form">
      <div class="form-group">
        <label class="form-label">Author:</label>
        <input class="form-input" type="text" placeholder="Enter author" v-model="inputValue1" required />
      </div>
      <div class="form-group">
        <label class="form-label">Title of Book:</label>
        <input class="form-input" type="text" placeholder="Enter title" v-model="inputValue2" required />
      </div>
      <div class="form-group">
        <label class="form-label">Rating:</label>
        <input class="form-input" type="text" placeholder="Enter rating" v-model="inputValue3" required />
      </div>
      <button type="submit" class="button">Submit</button>
    </form>

    <div class="card-list" v-if="showOutput">
      <div v-for="(value, index) in submittedValues" :key="index" class="card">
        <div v-for="(inputValue, inputIndex) in value" :key="inputIndex">
          <span v-if="inputIndex === 0">Author:</span>
          <span v-else-if="inputIndex === 1">Title of Book:</span>
          <span v-else-if="inputIndex === 2">Rating:</span>
          {{ inputValue }}<br />
        </div>
        <button @click="removeCard(index)" class="button">Remove</button>
      </div>
    </div>

    <div>
      <button class="button block" @click="signOut" :disabled="loading">Sign Out</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { createPinia } from 'pinia';

// Initialize Supabase client
const supabaseUrl = 'https://uxufjlzukuzxdfnggdtd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4dWZqbHp1a3V6eGRmbmdnZHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU2NTA2MjMsImV4cCI6MjAwMTIyNjYyM30.cHcOH7-bYmuCA4cNZSFNhW88-XjH1E64_wwAO2yZdmQ';
const supabase = createClient(supabaseUrl, supabaseKey);

// Create Pinia store
const pinia = createPinia();

const loading = ref(false);
const beginLogging = ref(false);
const showOutput = ref(false);
const inputValue1 = ref('');
const inputValue2 = ref('');
const inputValue3 = ref('');
const submittedValues = ref([]);

const validateInputs = () => {
  if (!inputValue1.value || !inputValue2.value || !inputValue3.value) {
    alert('Please fill in all required fields.');
    return false;
  }
  return true;
};

const resetInputs = () => {
  inputValue1.value = '';
  inputValue2.value = '';
  inputValue3.value = '';
};

const submit = async () => {
  if (validateInputs()) {
    const values = [
      inputValue1.value.trim(),
      inputValue2.value.trim(),
      inputValue3.value.trim(),
    ];

    // Insert values into the Supabase table
    const { data, error } = await supabase.from('bookLog').insert([
      { author: values[0], title: values[1], rating: values[2] },
    ]);

    if (error) {
      console.error('Error inserting values:', error.message);
    } else {
      submittedValues.value.push(values);
      showOutput.value = true;
      resetInputs();

      // Update local storage after submitting a new card
      localStorage.setItem('submittedValues', JSON.stringify(submittedValues.value));
    }
  }
};

const removeCard = async (index) => {
  const values = submittedValues.value[index];

  // Delete the record from the Supabase table
  const { data, error } = await supabase
    .from('bookLog')
    .delete()
    .eq('author', values[0])
    .eq('title', values[1])
    .eq('rating', values[2]);

  if (error) {
    console.error('Error deleting record:', error.message);
  } else {
    submittedValues.value.splice(index, 1);

    // Update local storage after removing the card
    localStorage.setItem('submittedValues', JSON.stringify(submittedValues.value));
  }
};

async function signOut() {
  try {
    loading.value = true;
    let { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

// Retrieve submitted values from local storage on component mount
onMounted(() => {
  const storedValues = localStorage.getItem('submittedValues');
  if (storedValues) {
    submittedValues.value = JSON.parse(storedValues);
    showOutput.value = true;
  }
});
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
  background-color: #f2f2f2;
  font-family: Arial, sans-serif;
}

.button {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  background-color: #4caf50;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #45a049;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 10px;
}

.form-label {
  font-weight: bold;
}

.form-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.card {
  width: 250px;
  padding: 10px;
  margin: 10px;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card span:first-child {
  font-weight: bold;
}

.card button {
  margin-top: 10px;
}
</style>
