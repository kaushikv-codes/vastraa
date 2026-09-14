// src/services/supabase.js
// Connects to Supabase from Node.js
// Same DB as your Flask backend — one database, two services talking to it

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// createClient = same concept as Python's create_client()
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default supabase
