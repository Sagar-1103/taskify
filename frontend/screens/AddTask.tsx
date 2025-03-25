import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { Button, RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BACKEND_URL } from '../constants/Backend';
import { useAuth } from '../context/AuthContext';

type NavigationProps = {
  navigation: any;
};

const AddTask = ({ navigation }: NavigationProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const {accessToken} = useAuth();

  const handleAddTask = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/tasks`,{ title, description },{
        headers:{ 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` }
      });

      const res = await response.data;
      if(res.success){
        navigation.goBack();
      }      
    } catch (error:any) {
      console.log(error.response.data.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Task</Text>

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

      <Button mode="contained" onPress={handleAddTask} style={styles.button}>
        Add Task
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

export default AddTask;
