import React from 'react';
import { Link, Stack } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView className='flex-1 items-center justify-center p-20'>
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        <Link href="/" className='mt-10 py-10'>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}
