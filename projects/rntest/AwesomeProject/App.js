/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { WebView } from 'react-native-webview';
import { Button } from 'react-native';

import ReactDOMServer from 'react-dom/server';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
  'Double tap R on your keyboard to reload,\n' +
  'Shake or press menu button for dev menu',
});

type Props = {};




const s = ReactDOMServer.renderToString(<h1>this escalated quickly</h1>)
export default class App extends Component<Props> {
  render() {
    console.log('hello')
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{s}</Text>
        <Text style={styles.instructions}>🙈🌍🐶</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Text style={styles.instructions}>🐳🏝</Text>
        <Button
  onPress={()=>{
    console.log("👌🏻")
    const hi = 'AAA'
    debugger;
    console.log("👌🏻")

  }}
  title="Learn More"
  color="#841584"
  accessibilityLabel="Learn more about this purple button"
/>
        <WebView
        originWhitelist={['*']}
        source={{ html: '<h1>Hello world</h1>' }}
        style={{flex:1, height: 80, width: 80}}
      />
        <Text style={styles.instructions}>HEY</Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
