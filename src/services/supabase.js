// src/services/supabase.js
// Cliente Supabase do TaskForm.
// Persiste a sessao no AsyncStorage para manter o login entre aberturas do app.

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nayrxjoogkrorzfkkpzy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_WfokxYxVz97be35UB9yNrQ_2DRlr2v8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
