import axios from "axios";
import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Card, Text, Title } from "react-native-paper";
import { BACKEND_URL } from "../constants/Backend";
import { useAuth } from "../context/AuthContext";

const Signup = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showError, setToastVisible, setIsLoading, setMessage } = useAuth();

  const validateEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      showError(
        "Missing Information, Please fill in all fields before submitting."
      );
      return;
    }
    if (!validateEmail(email)) {
      showError("Invalid Email, Invalid email format.");
      return;
    }
    if (password.length < 6) {
      showError("Short Password, Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      showError("Password Mismatch, Passwords do not match.");
      return;
    }
    setToastVisible(true);
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/signup`,
        { name, email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const res = await response.data;
      if (res.success) {
        navigation.navigate("Login");
        setToastVisible(true);
        setMessage("You have created an account");
      }
    } catch (error: any) {
      console.log(error.response?.data?.message || "Signup failed");
      showError(
        `Signup Error, ${error.response?.data?.message || "An error occurred"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.appName}>Taskify</Text>
      <Card style={styles.card}>
        <Title style={styles.title}>Create an Account</Title>
        <Text style={styles.subtitle}>
          Join Taskify to manage your tasks efficiently
        </Text>

        <TextInput
          theme={{
            colors: { primary: "#6200ea", onSurfaceVariant: "#6200ea" },
          }}
          textColor="black"
          label="Full Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          autoCapitalize="words"
        />
        <TextInput
          theme={{
            colors: { primary: "#6200ea", onSurfaceVariant: "#6200ea" },
          }}
          textColor="black"
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          theme={{
            colors: { primary: "#6200ea", onSurfaceVariant: "#6200ea" },
          }}
          textColor="black"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          theme={{
            colors: { primary: "#6200ea", onSurfaceVariant: "#6200ea" },
          }}
          textColor="black"
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
        />

        <Button
          mode="contained"
          textColor="white"
          onPress={handleSignup}
          style={styles.signupButton}
        >
          Sign Up
        </Button>

        <Text style={styles.loginButton}>
          Already have an account?{" "}
          <Text
            onPress={() => navigation.navigate("Login")}
            style={styles.loginText}
          >
            Login
          </Text>
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6200ea",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    padding: 25,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  signupButton: {
    backgroundColor: "#6200ea",
    paddingVertical: 5,
    borderRadius: 8,
  },
  loginButton: {
    marginTop: 15,
    textAlign: "center",
    color: "black",
  },
  loginText: {
    color: "#6200ea",
    fontWeight: "bold",
  },
});

export default Signup;
