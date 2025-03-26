import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Button, RadioButton } from 'react-native-paper';
import axios from 'axios';
import { BACKEND_URL } from '../constants/Backend';
import { useAuth } from '../context/AuthContext';
import LottieView from "lottie-react-native";
import Animation from "../assets/edit-animation.json";

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


const EditTask = ({ route, navigation }: any) => {
  const { task } = route.params;
  const { accessToken, showError,setIsLoading,setToastVisible,setMessage } = useAuth();
  
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status.charAt(0).toUpperCase() + task.status.slice(1));

  const handleUpdateTask = async () => {
    if (!title || !description || !status) {
      showError("Missing Information,Please fill in all fields before submitting.");
      return;
    }
    setToastVisible(true);
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${BACKEND_URL}/tasks/${task._id}`,
        { title, description, status: status.toLowerCase() },
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` } }
      );
      
      if (response.data.success) {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        setToastVisible(true);
        setMessage("Task edited successfully");
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      showError(`Unexpected Error,${error.response.data.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LottieAnimation />

      <Text style={styles.header}>Edit Task</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task title"
        placeholderTextColor="#A9A9A9"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter task description"
        placeholderTextColor="#A9A9A9"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Status</Text>
      <RadioButton.Group onValueChange={setStatus} value={status}>
        <View style={styles.radioContainer}>
          <View style={styles.radioOption}>
            <RadioButton value="Pending" color="#6200ea" />
            <Text style={styles.radioText}>Pending</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton value="Completed" color="#6200ea" />
            <Text style={styles.radioText}>Completed</Text>
          </View>
        </View>
      </RadioButton.Group>

      <Button mode="contained" onPress={handleUpdateTask} style={styles.button} labelStyle={styles.buttonText}>
        Update Task
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#6200ea',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#6200ea',
  },
  input: {
    borderWidth: 1,
    borderColor: '#6200ea',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'white',
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#6200ea',
    paddingVertical: 9,
    borderRadius: 12,
  }, 
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  lottieContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: -20,
  },
  lottie: {
    width: 160,
    height: 160,
  },
});

export default EditTask;
