import React, { useEffect, useState } from "react";
import { View, StyleSheet,ScrollView } from "react-native";
import { TextInput, Button, Card, Text, Title } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "../constants/Backend";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

import LottieView from "lottie-react-native";
import Animation from "../assets/logo-animation.json";

const LottieAnimation = () => {
  return (
    <View style={styles.lottieContainer}>
      <LottieView 
        source={Animation}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
};

const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {setAccessToken,setRefreshToken,setUser,showError,setIsLoading,setToastVisible} = useAuth();

  const handleLogin = async () => {
    if(!email || !password){
      showError("Missing Information,Please fill in all fields before submitting.");
      return;
    }
    setToastVisible(true);
    setIsLoading(true);
    try {
      const response  = await axios.post(`${BACKEND_URL}/auth/login`,{email, password},{
        headers: { "Content-Type": "application/json" }
      })
      const res = await response.data;
      if (res.success) {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setUser(res.data.user);
        await AsyncStorage.setItem('accessToken',res.data.accessToken)
        await AsyncStorage.setItem('refreshToken',res.data.refreshToken)
        await AsyncStorage.setItem('user',JSON.stringify(res.data.user))
      }
    } catch (error:any) {
      console.log(error.response.data);
      const message = error.response.data.message;
        showError(`Login Failed,${message}.`);
    } finally {
      setIsLoading(false);
      setToastVisible(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.appName}>Taskify</Text>
      <LottieAnimation/>

      <Card style={styles.card}>
        <Title style={styles.title}>Welcome Back!</Title>
        <Text style={styles.subtitle}>Sign in to continue</Text>

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

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.loginButton}
        >
          Login
        </Button>

        <Text
          style={styles.signupButton}
        >
          Don't have an account? <Text onPress={() => navigation.navigate("Signup")} style={styles.signupText}>Sign up</Text>
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
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
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
  loginButton: {
    backgroundColor: "#6200ea",
    paddingVertical: 5,
    borderRadius: 8,
  },
  lottieContainer: {
    width: "100%",
    alignItems: "center",
  },
  lottie: {
    width: 180,
    height: 180,
  },
  orText: {
    textAlign: "center",
    marginVertical: 15,
    fontSize: 14,
    color: "#666",
  },
  googleButton: {
    borderColor: "#6200ea",
    borderWidth: 1,
    paddingVertical: 5,
    borderRadius: 8,
  },
  signupButton: {
    marginTop: 15,
    textAlign: "center",
  },
  signupText: {
    color: "#6200ea",
    fontWeight: "bold",
  },
});

export default Login;
