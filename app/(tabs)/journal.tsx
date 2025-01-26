import React, { useState } from 'react';
import { Image, View, TextInput, Button, Platform, Alert } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { db, storage } from '@/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';

export default function JournalScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<Asset | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null)

  const selectImage = async () => {
    // const result = await launchImageLibrary({
    //   mediaType: 'photo',
    //   quality: 1,
    // });

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 1
    })

    if (result.canceled) {
      Alert.alert('Cancelled', 'Image selection cancelled');
      return
    }

    if (result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setImage(selectedAsset as Asset | null);
      setImageURL(selectedAsset?.uri ?? null);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('No image selected');
      return;
    }

    const response = await fetch(image.uri ?? '');
    const blob = await response.blob();

    const storageRef = ref(storage, `images/${image.fileName}`);
    const snapshot = await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(snapshot.ref);
    setImageURL(downloadURL);
  };

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
      <ThemedView className="flex-row items-center justify-center mt-10">
        <ThemedText className="text-xl font-bold">Photo</ThemedText>
        <Button title="Select Image" onPress={selectImage} />
        {imageURL && (
          <Image
            source={{ uri: imageURL }}
            className="w-20 h-20 rounded-full ml-2"
            resizeMode='cover'
          />
        )}
        <Button title="Upload Image" onPress={uploadImage} />
      </ThemedView>
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