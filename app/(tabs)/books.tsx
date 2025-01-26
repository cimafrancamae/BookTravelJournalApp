import React, { useState } from 'react';
import { View, FlatList, Image } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Record<string, string[]>>({}); // Key-value pair: bookId -> array of user-added reviews
  const [existingReviews, setExistingReviews] = useState<Record<string, string[]>>({}); // Key-value pair: bookId -> array of existing reviews

  const fetchBooks = async () => {
    if (!searchQuery) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      const fetchedBooks = data.items || [];

      setBooks(fetchedBooks);

      // Simulate fetching reviews for books
      const reviewsMock = fetchedBooks.reduce((acc: Record<string, string[]>, book: any) => {
        acc[book.id] = [`Great read!`, `Informative and engaging.`]; // Example mock reviews
        return acc;
      }, {});

      console.log('books:', data);
      setExistingReviews(reviewsMock);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const addReview = (bookId: string, reviewText: string) => {
    if (!reviewText.trim()) return;

    setReviews((prevReviews) => ({
      ...prevReviews,
      [bookId]: [...(prevReviews[bookId] || []), reviewText],
    }));
  };

  const renderBookItem = ({ item }: { item: any }) => {
    const { id, volumeInfo } = item;
    const { title, authors, description, imageLinks } = volumeInfo;

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
          <Button mode="outlined" onPress={() => console.log('Add Review')}>
            Add Review
          </Button>
        </Card.Actions>
        {/* Review Section */}
        <View className="p-4 bg-gray-100 rounded-b-lg">
          <Text className="text-lg font-semibold text-gray-700 mb-2">Reviews:</Text>

          {/* Existing Reviews */}
          {existingReviews[id]?.map((review, index) => (
            <Text key={`existing-${index}`} className="text-sm text-gray-700 mb-1">
              • {review}
            </Text>
          ))}

          {/* User-Added Reviews */}
          {reviews[id]?.map((review, index) => (
            <Text key={`user-${index}`} className="text-sm text-blue-700 mb-1">
              • {review}
            </Text>
          ))}

          {/* Add Review Input */}
          <TextInput
            placeholder="Write a review"
            mode="outlined"
            onSubmitEditing={(e) => addReview(id, e.nativeEvent.text)}
            className="mt-2"
          />
        </View>
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
