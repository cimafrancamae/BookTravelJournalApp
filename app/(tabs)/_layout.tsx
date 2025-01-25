import { Tabs, useSegments } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import { Button, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  "index": undefined;
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { user, logout } = useAuth();
  const segments = useSegments();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const currentPath = '/' + segments.join('/');
  
  
  const handleLogout = async () => {
    await logout();
  };
  
  useEffect(() => {
    console.log('user:',user,'Current Path:', currentPath);
    if (!user) {
      navigation.navigate("index");
    }
  }, [user]);  

  return (
    <>
      <View className='flex-row justify-between items-center p-4'>
        <Text>Welcome, {user?.email || "User"}!</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="bookReview"
          options={{
            title: 'Book Review',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="reviews.fill" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}