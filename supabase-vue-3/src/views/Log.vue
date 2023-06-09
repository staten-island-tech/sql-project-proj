<template>
    <div>
      <button @click="beginLogging = true">Begin Logging</button>
      <div v-if="beginLogging">
        <form @submit.prevent="submit">
          <label>Author:</label>
          <input ref="myInput1" type="text" placeholder="Enter value" v-model="inputValue1" required />
          <br />
          <label>Title of Book:</label>
          <input ref="myInput2" type="text" placeholder="Enter value" v-model="inputValue2" required />
          <br />
          <label>Rating:</label>
          <input ref="myInput3" type="text" placeholder="Enter value" v-model="inputValue3" required />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div class="card-list" v-if="showOutput">
        <div v-for="(value, index) in submittedValues" :key="index" class="card">
          <div v-for="(inputValue, inputIndex) in value" :key="inputIndex">
            <span v-if="inputIndex === 0">Author:</span>
            <span v-else-if="inputIndex === 1">Title of Book:</span>
            <span v-else-if="inputIndex === 2">Rating:</span>
            {{ inputValue }}<br />
          </div>
          <button @click="removeCard(index)">Remove</button>
        </div>
      </div>
      <div>
        <button class="button block" @click="signOut" :disabled="loading">Sign Out</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { createClient } from '@supabase/supabase-js';
  
  // Initialize Supabase client
  const supabaseUrl = 'https://uxufjlzukuzxdfnggdtd.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4dWZqbHp1a3V6eGRmbmdnZHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU2NTA2MjMsImV4cCI6MjAwMTIyNjYyM30.cHcOH7-bYmuCA4cNZSFNhW88-XjH1E64_wwAO2yZdmQ';
  const supabase = createClient(supabaseUrl, supabaseKey);
  
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
        inputValue3.value.trim()
      ];
  
      // Insert values into the Supabase table
      const { data, error } = await supabase
        .from('bookLog')
        .insert([{ author: values[0], title: values[1], rating: values[2] }]);
  
      if (error) {
        console.error('Error inserting values:', error.message);
      } else {
        submittedValues.value.push(values);
        showOutput.value = true;
        resetInputs();
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
  }
};

const signOut = async () => {
  try {
    loading.value = true;
    await supabase.auth.signOut();
    // Save the submitted values before signing out
    await saveSubmittedValues();
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
};

const saveSubmittedValues = async () => {
  try {
    const { data, error } = await supabase
      .from('submittedValues')
      .upsert([{ id: 1, values: submittedValues.value }], { onConflict: ['id'] });

    if (error) {
      console.error('Error saving submitted values:', error.message);
    }
  } catch (error) {
    console.error('Error saving submitted values:', error.message);
  }
};

// Load submitted values on component mount
onMounted(async () => {
  try {
    const { data, error } = await supabase.from('submittedValues').select();

    if (error) {
      console.error('Error loading submitted values:', error.message);
    } else {
      if (data.length > 0 && data[0].values) {
        submittedValues.value = data[0].values;
        showOutput.value = true;
      }
    }
  } catch (error) {
    console.error('Error loading submitted values:', error.message);
  }
});

// Save submitted values before component unmounts
onUnmounted(async () => {
  await saveSubmittedValues();
});
</script>
