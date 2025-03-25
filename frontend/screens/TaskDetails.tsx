import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskDetails = ({ route, navigation }:any) => {
  const { taskId } = route.params;
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`YOUR_BACKEND_URL/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTask(data);
      setTitle(data.title);
      setDescription(data.description);
    };
    fetchTask();
  }, []);

  const handleUpdate = async () => {
    const token = await AsyncStorage.getItem('token');
    await fetch(`YOUR_BACKEND_URL/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, description }),
    });
    Alert.alert('Updated', 'Task updated successfully');
    navigation.goBack();
  };

  const handleDelete = async () => {
    const token = await AsyncStorage.getItem('token');
    await fetch(`YOUR_BACKEND_URL/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    Alert.alert('Deleted', 'Task deleted');
    navigation.goBack();
  };

  return task ? (
    <View>
      <TextInput value={title} onChangeText={setTitle} />
      <TextInput value={description} onChangeText={setDescription} />
      <Button title="Update Task" onPress={handleUpdate} />
      <Button title="Delete Task" onPress={handleDelete} />
    </View>
  ) : <Text>Loading...</Text>;
};

export default TaskDetails;
