import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Text,
  Divider,
} from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { BACKEND_URL } from "../constants/Backend";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = ({ navigation }: any) => {
  const { user, accessToken, setAccessToken, setRefreshToken, setUser,setIsLoading,setToastVisible,setMessage } = useAuth();
  const [counts, setCounts] = useState<any>(null);

  const handleLogout = async () => {
    setToastVisible(true);
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const res = await response.data;
      if (res.success) {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        await AsyncStorage.clear();
        setToastVisible(true);
        setMessage("You have been logged out");
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword");
  };

  useEffect(() => {
    getCounts();
  }, []);

  const getCounts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/tasks/count`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const res = await response.data;
      if (res.success) {
        setCounts(res.data.counts);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <TouchableOpacity style={styles.avatarContainer}>
          <Avatar.Icon size={120} icon="account-circle" style={styles.avatar} />
        </TouchableOpacity>

        <Card.Content style={styles.userInfoContent}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </Card.Content>

        <Divider style={styles.divider} />

        <View style={styles.taskStatsContainer}>
          <StatBox value={counts?.totalTasks || 0} label="Active" />
          <StatBox value={counts?.completedTasks || 0} label="Completed" />
          <StatBox value={counts?.activeTasks || 0} label="Total" />
        </View>
      </Card>

      <View style={styles.actionButtonsContainer}>
        <Button
          mode="contained"
          icon="key-change"
          style={[styles.actionButton, styles.changePasswordButton]}
          labelStyle={styles.actionButtonText}
          onPress={handleChangePassword}
        >
          Change Password
        </Button>
        <Button
          mode="contained"
          icon="logout"
          style={[styles.actionButton, styles.logoutButton]}
          labelStyle={styles.actionButtonText}
          onPress={handleLogout}
        >
          Logout
        </Button>
      </View>
    </View>
  );
};

const StatBox = ({ value, label }: { value: number; label: string }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  card: {
    width: "100%",
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: "white",
    elevation: 5,
    alignItems: "center",
  },
  avatarContainer: {
    marginVertical: 20,
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    borderWidth: 2,
    borderColor: "#75a",
  },
  editAvatarOverlay: {
    position: "absolute",
    bottom: -10,
    right: -10,
    backgroundColor: "#6200ea",
    borderRadius: 20,
  },
  userInfoContent: {
    alignItems: "center",
    marginTop: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  divider: {
    width: "80%",
    marginVertical: 15,
  },
  taskStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  statBox: {
    alignItems: "center",
    padding: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6200ea",
  },
  statLabel: {
    fontSize: 14,
    color: "#555",
  },
  actionButtonsContainer: {
    marginTop: 20,
    gap: 15,
  },
  actionButton: {
    paddingVertical: 8,
    borderRadius: 10,
  },
  changePasswordButton: {
    backgroundColor: "#4CAF50", // Green color for change password
  },
  logoutButton: {
    backgroundColor: "#d32f2f",
  },
  actionButtonText: {
    fontSize: 16,
  },
});

export default Profile;
