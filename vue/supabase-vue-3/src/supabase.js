import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://crqnwkxbrsiaecqbqmjt.supabase.co'
const supabaseKey = 'process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cWNzc3J1eWpvbWxscXJla3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NjA1MDUsImV4cCI6MjAwMDQzNjUwNX0.mPWLUaKp-Ylmqxpm7VArxMMrvOEzB1lpQW8-YERbD-U'

export const supabase = createClient(supabaseUrl, supabaseKey)
