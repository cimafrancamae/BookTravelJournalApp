import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { GOOGLE_BOOKS_API_KEY, GOOGLE_PLACES_API_KEY } from '@env';
import * as Location from 'expo-location';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [category, setCategory] = useState('books');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      console.log("Current Location:", location);
    })();
  }, []);


  const searchBooks = async () => {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_BOOKS_API_KEY}`);
    const data = await response.json();
    setResults(data.items || []);
  };

  const searchPlaces = async (type) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
          alert('Permission to access location was denied');
          return;
      }
  
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
  
      console.log(`Searching for ${type} at ${latitude}, ${longitude}`);
  
      const response = await fetch(`http://localhost:3001/search-places?latitude=${latitude}&longitude=${longitude}&type=${type}`);
      const data = await response.json();
  
      console.log('API Response:', data);
  
      setResults(data.results || []);
    } catch (error) {
      console.error('Error fetching places:', error); 
    }
};


  const handleSearch = () => {
    if (category === 'books' || category === 'authors') {
      searchBooks();
    } else if (category === 'libraries') {
      searchPlaces('library');
    } else if (category === 'cafes') {
      searchPlaces('cafe');
    }
  };

  return (
    <View className='flex-1 p-4 bg-white'>
      <TextInput
        className='border p-2 rounded-lg'
        placeholder='Search...'
        value={query}
        onChangeText={setQuery}
      />
      
      <View className='flex-row justify-between mt-2'>
        {['books', 'authors', 'libraries', 'cafes'].map((item) => (
          <TouchableOpacity
            key={item}
            className={`p-2 rounded-lg ${category === item ? 'bg-blue-500' : 'bg-gray-300'}`}
            onPress={() => setCategory(item)}
          >
            <Text className='text-white'>{item.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity className='bg-blue-500 p-2 mt-2 rounded-lg' onPress={handleSearch}>
        <Text className='text-white text-center'>Search</Text>
      </TouchableOpacity>
      
      <FlatList
        data={results}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View className='p-2 border-b'>
            {category === 'books' || category === 'authors' ? (
              <View>
                <Image source={{ uri: item.volumeInfo?.imageLinks?.thumbnail }} className='w-16 h-24' />
                <Text className='font-bold'>{item.volumeInfo?.title}</Text>
                <Text>{item.volumeInfo?.authors?.join(', ')}</Text>
              </View>
            ) : (
              <View>
                <Text className='font-bold'>{item.name}</Text>
                <Text>{item.vicinity}</Text>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default SearchPage;
