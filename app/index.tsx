import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import Login from '@/app/auth/login';
import Register from '@/app/auth/register';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSegments } from 'expo-router';

const Index = () => {
  const [isRegistering, setIsRegistering] = useState(false); 
  const { user, loading } = useAuth();
  const router  = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.replace('/(tabs)');
    }
  }, [user, loading]);
  

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 justify-center items-center'>
      {!loading && !user && (
        <>
          {isRegistering ? <Register /> : <Login />}
          <Button
            title={isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
            onPress={() => setIsRegistering(!isRegistering)}
          />
        </>
      )}
      {loading && <Text>Loading...</Text>}
    </View>
  );
};

export default Index;
