import React, { useState } from 'react';
import { View, Button } from 'react-native';
import Login from '@/components/auth/login';
import Register from '@/components/auth/register';

const Index = () => {
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between Login and Register forms

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
