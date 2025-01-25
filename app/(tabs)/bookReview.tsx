import React, { useState } from 'react';
import { View, FlatList, Image } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';

export default function BookReviewPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    if (!searchQuery) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBookItem = ({ item }) => {
    const { title, authors, description, imageLinks } = item.volumeInfo;

    return (
      <Card className="mb-4 rounded-lg shadow-md">
        {imageLinks?.thumbnail && (
          <Image
            source={{ uri: imageLinks.thumbnail }}
            className="w-full h-40 rounded-t-lg"
          />
        )}
        <Card.Content className="p-4">
          <Text className="text-lg font-bold text-gray-800">{title}</Text>
          <Text className="text-sm text-gray-600">By: {authors?.join(', ')}</Text>
          <Text className="text-sm text-gray-500 mt-2" numberOfLines={3}>
            {description || 'No description available'}
          </Text>
        </Card.Content>
        <Card.Actions className="p-2">
          <Button mode="outlined">Review</Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <TextInput
        label="Search Books"
        value={searchQuery}
        onChangeText={setSearchQuery}
        mode="outlined"
        className="mb-4"
      />
      <Button
        mode="contained"
        onPress={fetchBooks}
        loading={loading}
        className="bg-blue-500 mb-4"
      >
        Search
      </Button>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={renderBookItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}
