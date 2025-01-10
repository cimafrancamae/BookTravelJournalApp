import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import Login from '@/components/auth/login';
import Register from '@/components/auth/register';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';

const Index = () => {
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between Login and Register forms
  const { user, loading } = useAuth();
  const router  = useRouter();

  useEffect(() => {
    console.log("User:", user, "Loading:", loading);
    if (user && !loading) {
      router.replace('/(tabs)');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isRegistering ? <Register /> : <Login />}
      <Button
        title={isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        onPress={() => setIsRegistering(!isRegistering)}
      />
    </View>
  );
};

export default Index;
