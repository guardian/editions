import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Notifications, BackgroundFetch, TaskManager } from 'expo';
import { Permissions } from 'expo';
import { AsyncStorage } from "react-native"


const taskName = 'test-background-fetch';
BackgroundFetch.setMinimumIntervalAsync(1);
TaskManager.defineTask(taskName, async () => {
  console.log('background fetch running');
  return BackgroundFetch.Result.NewData;
});

const askPermissions = async () => {
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;
  console.log(existingStatus)
  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    return false;
  }
  return true;
};



export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {title:"i am loading okay 🐳", saved: "save me 🦉"}
  }

  registerTaskAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync()
    console.log(status,BackgroundFetch.Status.Denied,BackgroundFetch.Status.Restricted)
    await BackgroundFetch.registerTaskAsync(taskName);
    console.log('task registered');
  };


  componentDidMount() {
    askPermissions()
    this.registerTaskAsync();

     const listener = async (notification) => {
  const r = await fetch('https://www.theguardian.com/lifeandstyle/shortcuts/2019/apr/23/forget-the-greige-age-the-case-for-painting-your-house-any-colour-you-like.json?guui')
  const j = await r.json()
  await AsyncStorage.setItem('a', 'I saved a string');
  this.setState({title: j.page.content.headline})
  console.log(new Date())

}
    (async() => {
      const a = await AsyncStorage.getItem('a');
      this.setState({a})
    })()
    askPermissions();
    Notifications.addListener(listener)
    console.log("WHAT")
    Notifications.scheduleLocalNotificationAsync({title: "HELLO", body: "WORLB",ios:{sound: true}},{time:(new Date()).getTime() + 10000})
  }

  render() {
    
    return (
      <View style={styles.container}>
        <Text>hello 🧜🏻‍</Text>
        <Text>{this.state.a || "nope 🙈"}</Text>
        <Text>{this.state.title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

