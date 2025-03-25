import axios from 'axios';
import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { Card, Text, Title, Button, IconButton } from 'react-native-paper';
import { BACKEND_URL } from '../constants/Backend';
import { useAuth } from '../context/AuthContext';

const TaskModal = ({ visible, task,setModalVisible,navigation }: any) => {
  if (!task) return null;
  const {accessToken} = useAuth();
  

  const onEdit = ()=>{
    setModalVisible(false);
    navigation.navigate('EditTask', { task });
  }

  const onDelete =async() => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/tasks/${task._id}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const res = await response.data;
      if(res.success){
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
        setModalVisible(false);
      }
    } catch (error) {
      console.log();
  
    }
    }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <Card style={styles.modalContent}>
          <View style={styles.header}>
            <Title style={styles.title}>{task.title}</Title>
            <IconButton icon="close" size={24} onPress={()=>setModalVisible(false)} />
          </View>

          <Text style={styles.taskDescription}>{task.description}</Text>
          <Text style={styles.taskMeta}>Status: <Text style={styles.statusText}>{task.status==='progress'?"In ":""}{task.status?.slice(0,1).toUpperCase() + task.status?.slice(1,)}</Text></Text>

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
    width: '85%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 10,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
  },
  taskDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    lineHeight: 22,
  },
  taskMeta: {
    fontSize: 14,
    color: '#777',
    marginBottom: 15,
  },
  statusText: {
    fontWeight: 'bold',
    color: '#6200ea',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 5,
  },
});

export default TaskModal;
