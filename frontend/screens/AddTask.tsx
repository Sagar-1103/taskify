import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios';
import { BACKEND_URL } from '../constants/Backend';
import { useAuth } from '../context/AuthContext';
import LottieView from "lottie-react-native";
import Animation from "../assets/add-animation.json";

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

const AddTask = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { accessToken, showError,setIsLoading,setToastVisible,setMessage } = useAuth();

  const handleAddTask = async () => {
    if (!title || !description) {
      showError("Missing Information, Please fill in all fields before submitting.");
      return;
    }
    setToastVisible(true);
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/tasks`,
        { title, description },
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` } }
      );
      const res = await response.data;
      if (res.success) {
        setToastVisible(true);
        setMessage("Task added successfully")
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      }
    } catch (error: any) {
      showError(`Unexpected Error, ${error.response?.data?.message || "Something went wrong"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LottieAnimation />
      
      <Text style={styles.header}>Add New Task</Text>
      
      <TextInput
        style={styles.input}
        placeholder='Enter task title'
        placeholderTextColor={'#A9A9A9'}
        value={title}
        onChangeText={setTitle}
      />
      
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder='Enter task description'
        placeholderTextColor={'#A9A9A9'}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Button mode='contained' onPress={handleAddTask} style={styles.button} labelStyle={styles.buttonText}>
        Add Task
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
    alignItems: "center",
  },
  lottieContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ea',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: '#6200ea',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#6200ea',
    paddingVertical: 9,
    borderRadius: 12,
    width: "100%",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  
});

export default AddTask;
