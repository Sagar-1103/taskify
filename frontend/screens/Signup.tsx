import axios from 'axios';
import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Text, Title } from 'react-native-paper';
import { BACKEND_URL } from '../constants/Backend';
import { useAuth } from '../context/AuthContext';

const Signup = ({ navigation }:any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {showError} = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    if(!name || !email || !password || !confirmPassword){
      showError("Missing Information,Please fill in all fields before submitting.");
      return;
    }
    if (!validateEmail(email)) {
      showError("Invalid Email,Invalid email format.");
      return;
    }
    if (password.length < 6) {
      showError("Short Password,Password must be at least 6 characters.");
      return;
    }
    if(password !== confirmPassword){
      showError("Password Mismatch,Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/signup`,{name,email,password},{
        headers: { "Content-Type": "application/json" }
      })
      const res = await response.data;
      if (res.success) {
        console.log('Success Account created successfully!');
        navigation.navigate('Login');
      }
    } catch (error:any) {
      console.log(error.response.data.message);
      showError(`Signup Error,${error.response.data.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.appName}>Taskify</Text>

      <Card style={styles.card}>
        <Title style={styles.title}>Create an Account</Title>
        <Text style={styles.subtitle}>Join Taskify to manage your tasks efficiently</Text>

        <TextInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          autoCapitalize="words"
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
        />

        <Button mode="contained" onPress={handleSignup} loading={loading} disabled={loading} style={styles.signupButton}>
          Sign Up
        </Button>

        <Text  style={styles.loginButton}>
          Already have an account? <Text onPress={() => navigation.navigate('Login')} style={styles.loginText}>Login</Text>
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ea',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    padding: 25,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  signupButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 5,
    borderRadius: 8,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 14,
    color: '#666',
  },
  googleButton: {
    borderColor: '#6200ea',
    borderWidth: 1,
    paddingVertical: 5,
    borderRadius: 8,
  },
  loginButton: {
    marginTop: 15,
    textAlign: 'center',
  },
  loginText: {
    color: '#6200ea',
    fontWeight: 'bold',
  },
});

export default Signup;
