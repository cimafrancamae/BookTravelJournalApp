import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { View, TextInput, Button, Alert } from "react-native";
import { useRouter } from "expo-router";

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await login(email, password);
            Alert.alert("Success", "Login successful!");
            router.replace('/');
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Login failed. Please try again.");
        }
    };

    return (
        <View className="flex-1 justify-center items-center p-16">
            <TextInput
                className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

export default Login;
