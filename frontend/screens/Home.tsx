import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  Card,
  Text,
  Title,
  FAB,
  Checkbox,
  IconButton,
  Divider,
} from "react-native-paper";
import TaskModal from "./TaskModal";
import { useAuth } from "../context/AuthContext";
import { BACKEND_URL } from "../constants/Backend";
import axios from "axios";

const Home = ({ navigation }: any) => {
  const [tasks, setTasks] = useState([]);
  const { accessToken } = useAuth();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const toggleComplete = (id: number) => {};

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
        const completedTasks = res.data.tasks.filter(
          (task: any) => task.status === "Completed"
        );
        const totalCount = res.data.tasks.length;
        setTotalTasks(totalCount);
        setCompletedTasks(completedTasks.length);
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
      {/* Task Counter */}
      <Card style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: "#4CAF50" }]}>
              {totalTasks-completedTasks}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: "#4CAF50" }]}>
              {completedTasks}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalTasks}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <Title style={styles.title}>Task List</Title>
        <Divider style={styles.divider} />
        <FlatList
          data={tasks}
          keyExtractor={(item: any) => item._id}
          renderItem={({ item }) => (
            <Card
              style={[
                styles.taskCard,
                item.status === "Completed" && styles.completedCard,
              ]}
            >
              <TouchableOpacity
                onPress={() => openModal(item)}
                style={styles.row}
              >
                <Checkbox
                  status={item.status === "Completed" ? "checked" : "unchecked"}
                  onPress={() => toggleComplete(item.id)}
                  color="#6200ea"
                />
                <Text
                  style={[
                    styles.taskTitle,
                    item.status === "Completed" && styles.completedText,
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No tasks available. Add a new task to get started!
              </Text>
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
