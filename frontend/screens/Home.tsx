import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Text, FAB } from "react-native-paper";
import TaskModal from "../components/TaskModal";
import { useAuth } from "../context/AuthContext";
import { BACKEND_URL } from "../constants/Backend";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import LottieView from "lottie-react-native";
import Animation from "../assets/empty-animation.json";

const LottieAnimation = () => {
  return (
    <View style={lottieStyle.container}>
      <LottieView 
        source={Animation}
        autoPlay
        loop
        style={lottieStyle.lottie}
      />
    </View>
  );
};

const Home = ({ navigation }: any) => {
  const [tasks, setTasks] = useState([]);
  const { accessToken } = useAuth();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

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
        const newTasks = res.data.tasks;
        setTasks(newTasks);
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
  
  const filteredTasks = tasks.filter((task:any) => {
    if (filter === 'completed') return task.status==="completed";
    if (filter === 'pending') return  task.status==="pending";
    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Your Tasks</Text>
        <View style={styles.filterContainer}>
          {['all', 'pending', 'completed'].map(filterType => (
            <TouchableOpacity
              key={filterType}
              style={[
                styles.filterButton,
                filter === filterType && styles.activeFilter
              ]}
              onPress={() => setFilter(filterType)}
            >
              <Text 
                style={[
                  styles.filterButtonText,
                  filter === filterType && styles.activeFilterText
                ]}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item: any) => item._id}
        renderItem={({ item }) => (
            <TaskCard item={item} openModal={openModal} setTasks={setTasks} navigation={navigation} />
          )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {!refreshing ? (
              <>
              <LottieAnimation/>
              <Text style={styles.emptyText}>
                        {filter === 'all' 
          ? "No tasks available. Add a new task to get started!" 
          : filter === 'pending' 
          ? "You're all caught up! No pending tasks left." 
          : "No completed tasks yet. Finish some tasks to see them here!"}
              </Text>
              </>
            ) : 
              null
            }
          </View>
        }
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={fetchTasks} 
            colors={['#6200ea']}
          />
        }
      />

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
    backgroundColor: "white",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    alignSelf: 'flex-start',
    padding: 4,
    marginBottom:10
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: '#6200ea',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 14,
  },
  activeFilterText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  taskItem: {
    marginBottom: 15,
  },
  taskContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedTask: {
    opacity: 0.6,
  },
  taskContent: {
    flex: 1,
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  priorityChip: {
    alignSelf: 'flex-start',
  },
  priorityChipText: {
    color: 'white',
    fontSize: 12,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#6200ea",
    borderRadius: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    padding:25
  },
});

const lottieStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  lottie: {
    width: 200,
    height: 200,
  },
});

export default Home;