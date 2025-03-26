import axios from 'axios';
import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { Card, Text, Title, Button, IconButton } from 'react-native-paper';
import { BACKEND_URL } from '../constants/Backend';
import { useAuth } from '../context/AuthContext';

const TaskModal = ({ visible, task, setModalVisible, navigation }: any) => {
  if (!task) return null;
  
  const { accessToken, setMessage, setVisible,setIsLoading,setToastVisible } = useAuth();

  const showError = (message: string) => {
    setMessage(message);
    setVisible(true);
  };

  const onEdit = () => {
    setModalVisible(false);
    navigation.navigate('EditTask', { task });
  };

  const onDelete = async () => {
    setToastVisible(true);
    setIsLoading(true);
    try {
      const response = await axios.delete(`${BACKEND_URL}/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.data.success) {
        navigation.reset({ index: 0, routes: [{ name: "Home" }] });
        setModalVisible(false);
        setToastVisible(true);
        setMessage("Task deleted successfully");
      }
    } catch (error: any) {
      showError(`Unexpected Error,${error.response.data.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <Card style={styles.modalContent}>
          <View style={styles.header}>
            <Title style={styles.title}>{task.title}</Title>
            <IconButton 
              icon="close" 
              size={24} 
              iconColor="#6200ea" 
              onPress={() => setModalVisible(false)} 
            />
          </View>

          <Text style={styles.taskDescription}>{task.description}</Text>
          <Text style={styles.taskMeta}>
            Status: <Text style={[styles.statusText, { color: task.status === 'completed' ? '#388e3c' : '#f57c00' }]}>
              {task.status?.charAt(0).toUpperCase() + task.status?.slice(1)}
            </Text>
          </Text>

          <View style={styles.modalActions}>
            <Button mode="contained" icon="pencil" onPress={onEdit} style={styles.editButton}>
              Edit
            </Button>
            <Button mode="contained" icon="delete" buttonColor="#d32f2f" onPress={onDelete} style={styles.deleteButton}>
              Delete
            </Button>
          </View>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    elevation: 10,
    shadowColor: '#6200ea',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6200ea',
    flexShrink: 1,
  },
  taskDescription: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
    lineHeight: 22,
  },
  taskMeta: {
    fontSize: 15,
    color: '#666',
    marginBottom: 15,
    fontWeight: '600',
  },
  statusText: {
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    flex: 1,
    marginRight: 5,
    backgroundColor: '#6200ea',
    borderRadius: 10,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 5,
    borderRadius: 10,
  },
});

export default TaskModal;
