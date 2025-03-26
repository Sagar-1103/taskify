import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Snackbar, Text } from "react-native-paper";

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
  isLoading: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, visible, onDismiss, duration = 3000, isLoading }) => {
  return (
    <View style={styles.container}>
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={isLoading ? Number.MAX_VALUE : duration}
        action={!isLoading ? { label: "OK", onPress: onDismiss } : undefined}
        style={styles.snackbar}
      >
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.text}> Loading...</Text>
          </View>
        ) : (
          <Text style={styles.text}>{message}</Text>
        )}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000, 
  },
  snackbar: {
    backgroundColor: "#333",
    alignSelf: "center",
    width: "90%",
  },
  text: {
    color: "#fff",
  },
  loaderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Toast;
