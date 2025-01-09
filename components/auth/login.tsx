import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            await login(email, password);
            alert("Login successful!");
        } catch (error) {
            console.error(error);
            alert("Login failed. Please try again.");
        }
    };

    return (
        <div>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>"
        </div>
    );
};

export default Login;