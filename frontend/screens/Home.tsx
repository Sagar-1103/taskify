import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card, Text, Title, FAB, Checkbox, Divider } from "react-native-paper";
import TaskModal from "../components/TaskModal";
import { useAuth } from "../context/AuthContext";
import { BACKEND_URL } from "../constants/Backend";
import axios from "axios";
import TaskCard from "../components/TaskCard";

const Home = ({ navigation }: any) => {
  const [tasks, setTasks] = useState([]);
  const { accessToken } = useAuth();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const openModal = (task: any) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const fetchTasks = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const res = await response.data;
      if (res.success) {
        setTasks(res.data.tasks);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Title style={styles.title}>Task List</Title>
        <Divider style={styles.divider} />
        <FlatList
          data={tasks}
          keyExtractor={(item: any) => item._id}
          renderItem={({ item }) => (
            <TaskCard
              item={item}
              openModal={openModal}
              navigation={navigation}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              {!refreshing ? (
                <Text style={styles.emptyText}>
                  No tasks available. Add a new task to get started!
                </Text>
              ) : (
                <Text style={styles.emptyText}>
                  Loading...
                </Text>
              )}
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchTasks} />
          }
        />
      </Card>

      <FAB
        style={styles.fab}
        icon="plus"
        color="white"
        onPress={() => navigation.navigate("AddTask")}
      />

      <TaskModal
        visible={modalVisible}
        task={selectedTask}
        setModalVisible={setModalVisible}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  statsCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "white",
    marginBottom: 20,
    elevation: 3,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6200ea",
  },
  statLabel: {
    fontSize: 14,
    color: "#777",
  },
  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "white",
    marginBottom: 60,
    elevation: 5,
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  divider: {
    marginBottom: 10,
  },
  taskCard: {
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  completedCard: {
    backgroundColor: "#e8f5e9",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#6200ea",
    borderRadius: 50,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Home;
