
import { StyleSheet, Text, TextInput, View, Button, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { firestore, collection, addDoc, serverTimestamp, MESSAGES } from './firebase/Config';
import { useEffect, useState } from 'react';
import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { convertFirebaseTimeStampToJS } from './helpers/Functions';


export default function App() {
  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const q = query(collection(firestore, MESSAGES),orderBy("created", "desc"));
 
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempMessages = [];

      querySnapshot.forEach((doc) => {
        // Create and format message object based on data retrieved from database
        const messageObject = {
          id: doc.id,
          text: doc.data().text,
          created: convertFirebaseTimeStampToJS(doc.data().created)
        }
        tempMessages.push(messageObject)
      })
      setMessages(tempMessages);
    })

    return () => {
      unsubscribe();
    }
  }, []);

  const save = async () => {
    const docRef = await addDoc(collection(firestore, MESSAGES), {
      text: newMessage,
      created: serverTimestamp()
    }).catch(error => console.error(error));

    setNewMessage("");
    console.log("Message saved")
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {
          messages.map((message) => (
            <View style={styles.message} key={message.id}>
              <Text style={styles.messageInfo}>{message.created} </Text>
              <Text>{message.text}</Text>
              
            </View>
          ))
        }
    <View style={styles.sendMsg}>
      <TextInput placeholder='Send message...' value={newMessage} onChangeText={text => setNewMessage(text)} />
     
      <TouchableOpacity onPress={save}
      style={styles.sendBtn}>
        <Text>Send</Text>
      </TouchableOpacity>
    </View>
      
    
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
  paddingTop: 20,
  flex: 1,
  backgroundColor: '#fff',
  },
  message: {
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: "#eee",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20,  
  },
  messageInfo: {
    color: "#E3BAFD",
    marginBottom: 5,
    fontSize: 12,
  },

  sendMsg: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#eee",
    borderColor: "#E3BAFD",
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 40,
  },
  sendBtn: {
    backgroundColor: "#E3BAFD",
    padding: 10,
    borderRadius: 5,
    color: "white",
  },
});
