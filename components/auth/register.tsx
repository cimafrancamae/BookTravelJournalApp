import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();

    const handleSubmit = async() => {
        try {
            await register(email, password);
            alert("Registration successful");
        } catch (error) {
            console.error(error);
            alert("Registration failed. Please try again.");
        }
    }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">Signup</h1>
      <form className="flex flex-col items-center">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 mb-4"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 text-white rounded-md px-4 py-2"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;