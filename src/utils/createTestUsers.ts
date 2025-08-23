import { supabase } from "@/integrations/supabase/client";

export const testUsers = [
  {
    email: "john.doe@example.com",
    password: "password123",
    full_name: "John Doe"
  },
  {
    email: "jane.smith@example.com", 
    password: "password123",
    full_name: "Jane Smith"
  },
  {
    email: "alex.johnson@example.com",
    password: "password123",
    full_name: "Alex Johnson"
  },
  {
    email: "demo@test.com",
    password: "demo123",
    full_name: "Demo User"
  }
];

export const createTestUsers = async () => {
  const results = [];
  
  for (const user of testUsers) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            full_name: user.full_name,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        },
      });

      if (error) {
        console.error(`Failed to create user ${user.email}:`, error.message);
        results.push({ email: user.email, success: false, error: error.message });
      } else {
        console.log(`Successfully created user: ${user.email}`);
        results.push({ email: user.email, success: true, data });
      }
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error);
      results.push({ email: user.email, success: false, error: 'Unexpected error' });
    }
  }
  
  return results;
};

// Function to sign in as a test user
export const signInAsTestUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error.message);
      return { success: false, error: error.message };
    }

    console.log('Successfully signed in as:', email);
    return { success: true, data };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: 'Unexpected error' };
  }
};