import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Dimensions } from 'react-native'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig'; 
import { FlashList } from "@shopify/flash-list";

type Journal = {
  id: string;
  imageUrl: string;
  description: string;
  height?: number;
};

export default function HomePage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get("window").width;
  const columnWidth = (screenWidth - 20) / 2; 

  useEffect(() => {
    console.log('Fetching journals...');
    async function fetchJournals() {
      try {
        const querySnapshot = await getDocs(collection(db, 'journals'));
        const journalData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          imageUrl: doc.data().imageUrl,
          description: doc.data().description,
          ...doc.data(),
         }));
         console.log('Fetched journals:', journalData);
        setJournals(journalData);
      } catch (error) {
        console.error('Error fetching journals:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchJournals();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-2">
      <FlashList
        data={journals}
        keyExtractor={(item) => item.id}
        numColumns={2}
        estimatedItemSize={200}
        renderItem={({ item }) => (
          <View className="p-1">
            <Image source={{ uri: item.imageUrl }} style={{ width: columnWidth, height: Math.random() * 100 + 150, borderRadius: 10 }} />
            <Text className="text-center text-sm mt-1">{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}
