import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BACKEND_URL } from '../constants/Backend';

const ChangePassword = ({ navigation }: any) => {
  const { accessToken,showError,setIsLoading,setToastVisible,setMessage } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showError("Missing Information,Please fill in all fields before submitting.");
      return;
    }

    if (newPassword.length < 6 || confirmPassword.length<6) {
      showError("Short Password,Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("Password Mismatch,New passwords do not match.");
      return;
    }

    setToastVisible(true);
    setIsLoading(true);

    try {
      const response = await axios.patch(
        `${BACKEND_URL}/auth/reset-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const res = await response.data;

      if (res.success) {
        navigation.navigate("Home");
        setToastVisible(true);
        setMessage("Password changed successfully");
      }
    } catch (error: any) {
      console.log(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.headerText}>Change Your Password</Text>
        
        <View style={styles.inputWrapper}>
          <TextInput
            mode="outlined"
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!isCurrentPasswordVisible}
            style={styles.input}
            outlineColor="#6200ea"
            activeOutlineColor="#6200ea"
            right={
              <TextInput.Icon 
                icon={isCurrentPasswordVisible ? "eye-off" : "eye"}
                onPress={() => setIsCurrentPasswordVisible(!isCurrentPasswordVisible)}
                color="#6200ea"
              />
            }
          />

          <TextInput
            mode="outlined"
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!isNewPasswordVisible}
            style={styles.input}
            outlineColor="#6200ea"
            activeOutlineColor="#6200ea"
            right={
              <TextInput.Icon 
                icon={isNewPasswordVisible ? "eye-off" : "eye"}
                onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                color="#6200ea"
              />
            }
          />

          <TextInput
            mode="outlined"
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!isConfirmPasswordVisible}
            style={styles.input}
            outlineColor="#6200ea"
            activeOutlineColor="#6200ea"
            right={
              <TextInput.Icon 
                icon={isConfirmPasswordVisible ? "eye-off" : "eye"}
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                color="#6200ea"
              />
            }
          />

          <Button
            mode="contained"
            onPress={handleChangePassword}
            style={styles.changePasswordButton}
            labelStyle={styles.buttonLabel}
          >
            Update Password
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ea',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputWrapper: {
    width: '100%',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  changePasswordButton: {
    marginTop: 20,
    backgroundColor: '#6200ea',
    paddingVertical: 9,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#6200ea',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});

export default ChangePassword;