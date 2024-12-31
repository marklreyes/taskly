import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";

export default function CounterScreen() {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsElapsed((val) => val + 1);
    }, 1000);
    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const scheduleNotification = async () => {
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      console.log(result);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "I'm a notification from your app.",
        },
        trigger: {
          seconds: 5,
          type: "timeInterval",
          repeats: false,
        },
      });
    } else {
      if (Device.isDevice) {
        Alert.alert(
          "Unable to schedule notification.",
          "Enable the notification permission for Expo Go in the settings.",
        );
      }
    }
  };
  return (
    <View style={styles.container}>
      <Text>{secondsElapsed}</Text>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={scheduleNotification}
      >
        <Text style={styles.buttonText}>Schedule a notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
