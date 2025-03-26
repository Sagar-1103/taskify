import axios from 'axios';
import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Animated } from 'react-native';
import { Card, Checkbox } from 'react-native-paper';
import { BACKEND_URL } from '../constants/Backend';
import { useAuth } from '../context/AuthContext';

const TaskCard = ({ item, openModal, setTasks }: any) => {
  const { accessToken } = useAuth();
  const [tempCheck, setTempCheck] = useState(item.status === "completed");
  const animatedOpacity = new Animated.Value(tempCheck ? 0.5 : 1); // Fades the task when completed

  const handleToggleCheck = async () => {
    setTempCheck((prev) => !prev);
    
    // Smooth opacity transition
    Animated.timing(animatedOpacity, {
      toValue: tempCheck ? 1 : 0.5,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTasks((prevTasks: any) =>
      prevTasks.map((task: any) =>
        task._id === item._id ? { ...task, status: item.status === 'pending' ? 'completed' : 'pending' } : task
      )
    );

    try {
      const response = await axios.put(
        `${BACKEND_URL}/tasks/${item._id}`,
        {
          title: item.title,
          description: item.description,
          status: item.status === "completed" ? "pending" : "completed",
        },
        {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        }
      );
      
      if (!response.data.success) {
        throw new Error("Failed to update task.");
      }
    } catch (error: any) {
      console.log(error.response?.data?.message || "Error updating task.");
      setTempCheck(!tempCheck);
      setTasks((prevTasks: any) =>
        prevTasks.map((task: any) =>
          task._id === item._id ? { ...task, status: tempCheck ? "completed" : "pending" } : task
        )
      );
    }
  };

  return (
    <TouchableOpacity onPress={() => openModal(item)} activeOpacity={0.95}>
      <Animated.View style={[styles.animatedWrapper, { opacity: animatedOpacity }]}>
        <Card style={[styles.taskCard, tempCheck && styles.completedCard]}>
          <View style={styles.row}>
            <Checkbox
              status={tempCheck ? "checked" : "unchecked"}
              onPress={handleToggleCheck}
              color="#6200ea"
            />
            <View style={styles.textContainer}>
              <Text style={[styles.taskTitle, tempCheck && styles.completedText]}>
                {item.title}
              </Text>
              {item.description && (
                <Text style={[styles.taskDescription, tempCheck && styles.completedDescription]}>
                  {item.description.length > 35 ? `${item.description.slice(0, 35)}...` : item.description}
                </Text>
              )}
            </View>
          </View>
        </Card>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  animatedWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  taskCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderLeftWidth: 6,
    borderLeftColor: "#6200ea",
  },
  completedCard: {
    backgroundColor: "#f3f3f3",
    borderLeftColor: "#4CAF50",
    opacity: 0.7,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  completedDescription: {
    color: "#aaa",
  },
});

export default TaskCard;
