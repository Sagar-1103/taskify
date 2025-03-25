import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { Button, RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BACKEND_URL } from '../constants/Backend';

const EditTask = ({ route, navigation }: any) => {
  const { task } = route.params;
  const {accessToken} = useAuth();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);

  const handleUpdateTask = async () => {
    try {
      if (!title || !description || !status) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      const response = await axios.put(`${BACKEND_URL}/tasks/${task._id}`,{title,description,status},{
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      })
      const res = await response.data;
      if (res.success) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }
    } catch (error:any) {
      console.log(error.response.data.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Task</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Status</Text>
      <RadioButton.Group onValueChange={setStatus} value={status}>
        <View style={styles.radioContainer}>
          <View style={styles.radioOption}>
            <RadioButton value="Pending" />
            <Text>Pending</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton value="In Progress" />
            <Text>In Progress</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton value="Completed" />
            <Text>Completed</Text>
          </View>
        </View>
      </RadioButton.Group>

      <Button mode="contained" onPress={handleUpdateTask} style={styles.button}>
        Update Task
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#6200ea',
    paddingVertical: 8,
    borderRadius: 10,
  },
});

export default EditTask;
