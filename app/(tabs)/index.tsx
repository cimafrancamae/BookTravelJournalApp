import React from 'react';
import { Image, View, TextInput, Button, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { db } from '@/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

export default function HomeScreen() {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [tags, setTags] = React.useState('');

  const handlePost = async () => {
    if (!title || !description || !tags) {
      alert('Please fill in all fields!');
      return;
    }
    
    try {
      const docRef = await addDoc(collection(db, 'journalEntries'), {
        title,
        description,
        tags,
        createdAt: new Date().toISOString(),
      });
      console.log("Document written with ID: ", docRef.id);

      //clear fields
      setTitle('');
      setDescription('');
      setTags('');
      
      //show success message
      alert('Post added successfully!');

    } catch (e) {
      console.error("Error adding document: ", e);
      alert('Error adding post!');
    }
    

    console.log('Title:', title);
    console.log('Description:', description);
    console.log('Tags:', tags);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/pexels-books.jpg')}
          className='w-1/2 h-1/2 bottom-0 left-0 absolute'
        />
      }>
      <View className="flex-1 justify-center items-center p-16">
          <TextInput
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              autoCapitalize="none"
          />
          <TextInput
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              autoCapitalize="none"
          />
          <TextInput
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
              placeholder="Tags"
              value={tags}
              onChangeText={setTags}
              autoCapitalize="none"
          />
          <Button title="Post" onPress={handlePost} />
      </View>
    </ParallaxScrollView>
  );
}