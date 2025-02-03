import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture, Camera } from 'expo-camera';
import React, { useState, useRef } from 'react';
import {  Text, TouchableOpacity, View, Image, TextInput, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-paper';
import { db, storage } from '@/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function JournalPage() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [uploading, setUploading] = useState(false);
  // const cameraRef = useRef<typeof Camera | null>(null);
  const cameraRef = useRef<CameraView>(null); // Corrected type
  const screenHeight = Dimensions.get("window").height; // Get full screen height

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className='flex-1 items-center justify-center'>
        <Text className='text-lg align-center pb-4'>We need your permission to show the camera</Text>
        <Button onPress={requestPermission}>Grant permission</Button>
      </View>
    );
  }

  function toggleCameraFacing() {
    console.log(facing);
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const capturePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          console.log('Photo captured:', photo.uri);
          setImage(photo.uri);
        } else {
          console.error('No photo captured');
        }
      } catch (error) {
        console.error('Error capturing photo:', error);
      }
    }
  };

  async function postImage() {
    if (!image) return;
    setUploading(true);
    
    const response = await fetch(image);
    const blob = await response.blob();
    const storageRef = ref(storage, `images/${Date.now()}.jpg`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    
    await addDoc(collection(db, 'journals'), {
      imageUrl: downloadURL,
      description,
      hashtags: hashtags.split(' '),
      timestamp: new Date(),
    });
    
    setImage(null);
    setDescription('');
    setHashtags('');
    setUploading(false);
  }

  return (
    <View className='flex-1 justify-center'>
      {!image ? (
        <CameraView ref={cameraRef} className='flex-1' style={{ height: screenHeight - 80 }} facing={facing}>
          <View className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
            <TouchableOpacity className='self-end flex-1 align-center' onPress={toggleCameraFacing}>
              <Icon name="camera-flip" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className='self-end flex-1 align-center' onPress={pickImage}>
              <Icon name="image" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Capture Button at the Bottom Center */}
          <View className="absolute bottom-8 w-full flex-row justify-center">
            <TouchableOpacity 
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center" 
              onPress={capturePhoto}
            >
              <Icon name="camera" size={32} color="black" />
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View className="flex-1 justify-center items-center">
           {/* Back Button */}
            <TouchableOpacity className="absolute top-8 left-4 bg-gray-700 p-2 rounded-full" onPress={() => setImage(null)}>
              <Icon name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            
          <Image source={{ uri: image }} className="w-80 h-96 mb-4" />
          <TextInput className="border p-2 w-80 mb-2" placeholder="Enter description..." value={description} onChangeText={setDescription} />
          <TextInput className="border p-2 w-80 mb-4" placeholder="#hashtags" value={hashtags} onChangeText={setHashtags} />
          <Button mode="contained" onPress={postImage} loading={uploading}>Post</Button>
        </View>
      )}
    </View>
  );
}
