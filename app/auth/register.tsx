import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useRouter } from "expo-router";

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            await register(email, password);
            Alert.alert("Success", "Registration successful");
            router.push("/");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Registration failed. Please try again.");
        }
    };

    return (
        <View className="flex-1 justify-center items-center p-16">
            <Text className="text-2xl font-bold mb-4">Register</Text>
            <TextInput
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Register" onPress={handleSubmit} />
        </View>
    );
};

export default Register;
