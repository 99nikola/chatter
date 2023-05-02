import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const webSocket = new WebSocket("ws://192.168.1.87:3030/chat");

export default function App() {
  const onOpen = () => {
    console.log("server with connected");

    webSocket.addEventListener("message", onMessage);
    console.log("sending message");

    webSocket.send(
      JSON.stringify({
        event: "ok/testing/something",
        data: "TEST DATA"
      })
    );

    webSocket.send(
      JSON.stringify({
        event: "events",
        data: {
          id: 12
        }
      })
    );
  };
  const onError = (e: Event) => {
    console.error(e);
  };
  const onClose = () => {
    webSocket.removeEventListener("message", onMessage);
  };
  const onMessage = (event: WebSocketMessageEvent) => {
    console.log("message recieved", event);
  };

  useEffect(() => {
    webSocket.addEventListener("open", onOpen);
    webSocket.addEventListener("error", onError);
    webSocket.addEventListener("close", onClose);

    return () => {
      webSocket.close();
      webSocket.removeEventListener("open", onOpen);
      webSocket.removeEventListener("error", onError);
      webSocket.removeEventListener("close", onClose);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>APP</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
