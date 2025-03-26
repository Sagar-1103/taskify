import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text, Divider } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BACKEND_URL } from '../constants/Backend';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }: any) => {
  const { user, accessToken, setAccessToken, setRefreshToken, setUser } = useAuth();
  const [counts,setCounts] = useState<any>(null);

  const handleLogout = async () => {
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
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  useEffect(()=>{
    getCounts();
  },[])

  const getCounts = async()=>{
    try {
      const response = await axios.get(`${BACKEND_URL}/tasks/count`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const res = await response.data;
      if(res.success){
        setCounts(res.data.counts);
      }
    } catch (error:any) {
      console.log(error.response.data.message);
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.avatarContainer}>
          <Avatar.Icon size={100} icon="account-circle" style={styles.avatar} />
        </View>
        <Card.Content>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </Card.Content>
        
        <Divider style={styles.divider} />
        
        <View style={styles.taskStatsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{counts?.totalTasks || 0}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{counts?.completedTasks || 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{counts?.activeTasks || 0}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </Card>
      
      <Button
        mode="contained"
        icon="logout"
        style={styles.logoutButton}
        labelStyle={styles.logoutText}
        onPress={handleLogout}
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  card: {
    width: '100%',
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: 'white',
    elevation: 5,
    alignItems: 'center',
  },
  avatarContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 1,
    borderColor: '#6200ea',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  divider: {
    width: '80%',
    marginVertical: 15,
  },
  taskStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  statBox: {
    alignItems: 'center',
    padding: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6200ea',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#d32f2f',
    paddingVertical: 8,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 16,
  },
});

export default Profile;