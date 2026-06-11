import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jzfeifpdnruyuldslxqn.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Rf80JphBQlBFfc5iKKTA5g_28vH-zH9.';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
