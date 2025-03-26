import axios from 'axios';
import React, { useState } from 'react';
import { Text, TouchableOpacity,StyleSheet} from 'react-native';
import { Card, Checkbox } from 'react-native-paper';
import { BACKEND_URL } from '../constants/Backend';
import { useAuth } from '../context/AuthContext';

const TaskCard = ({item,openModal,navigation}:any) => {
    const {accessToken} = useAuth();
    const [tempCheck,setTempCheck] = useState(item.status === "completed");
    const handleToggleCheck = async (task:any) => {
        setTempCheck((prev)=>!prev);
        try {
          const response = await axios.put(`${BACKEND_URL}/tasks/${item._id}`,{title:item.title,description:item.description,status:item.status==="completed"?"pending":"completed"},{
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          })
          const res = await response.data;
          if (res.success) {
          }
        } catch (error:any) {
          console.log(error.response.data.message);
          setTempCheck(tempCheck);
        }
      };

    return (
        <Card
              style={[
                styles.taskCard,
                tempCheck && styles.completedCard,
              ]}
            >
              <TouchableOpacity
                onPress={() => openModal(item)}
                style={styles.row}
              >
                <Checkbox
                  status={tempCheck ? "checked" : "unchecked"}
                  onPress={() => handleToggleCheck(item)}
                  color="#6200ea"
                />
                <Text
                  style={[
                    styles.taskTitle,
                    tempCheck && styles.completedText,
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            </Card>
    );
};

const styles = StyleSheet.create({
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
  }
});

export default TaskCard;
