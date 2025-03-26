import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Signup from './screens/Signup';
import Login from './screens/Login';
import Home from './screens/Home';
import AddTask from './screens/AddTask';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Avatar, PaperProvider } from 'react-native-paper';
import EditTask from './screens/EditTask';
import Profile from './screens/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SafeAreaProvider } from "react-native-safe-area-context";
import ChangePassword from './screens/ChangePassword';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} />
  </Stack.Navigator>
);

const AppStack = () => (
  <>
  <Stack.Navigator
    screenOptions={({ navigation,route }) => ({
      headerStyle: { backgroundColor: '#6200ea' },
      headerTitleStyle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
      headerTitleAlign: 'center',
      headerTitle: 'Taskify',
      headerTintColor: '#fff',
      headerRight: () =>  route.name !== 'Profile' ? (
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Avatar.Icon size={42} icon="account" style={styles.avatar} />
        </TouchableOpacity>
      ) : null,
    })}
  >
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="AddTask" component={AddTask} />
    <Stack.Screen name="EditTask" component={EditTask} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="ChangePassword" component={ChangePassword} />
  </Stack.Navigator>
  </>
);

const RootNavigator = () => {
  const { accessToken } = useAuth();

  return (
    <NavigationContainer>
      {accessToken ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
    <AuthProvider>
      <PaperProvider>
        <RootNavigator />
      </PaperProvider>
    </AuthProvider>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#6200ea',
    borderWidth:2,
    marginHorizontal:8,
    borderColor:"#A9A9A9"
  },
});
