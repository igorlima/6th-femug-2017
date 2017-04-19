import React, { Component } from 'react'
import { Text, View, ListView, StyleSheet } from 'react-native'
import firebase from 'firebase'

/*
React Native is a great option for creating performant iOS and Android apps
that feel at home on their respective platforms.

For further details, feel free to take a look at the great RN documentation.
- https://facebook.github.io/react-native/docs/getting-started.html
**/
const FIREBASE_PROPERTY = 'chat'
// Initialize Firebase
const config = {
  apiKey: "AIzaSyAp-CLeimcXe59hvyNqpL66R0TQUyyoNjo",
  authDomain: "talk2016-9079a.firebaseapp.com",
  databaseURL: "https://talk2016-9079a.firebaseio.com",
  storageBucket: "talk2016-9079a.appspot.com",
}
firebase.initializeApp(config)
const database = firebase.database()

class Message extends Component {
  render () {
    const {author, msg} = this.props
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageAuthor}>{author}</Text>
        <Text style={styles.messageText}>{msg}</Text>
      </View>
    )
  }
}

class ChatExample extends Component {
  constructor () {
    super()
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      message: [],
      dataSource: ds.cloneWithRows([])
    }
  }
  
  componentDidMount () {
    database
    .ref(FIREBASE_PROPERTY)
    .orderByChild('dt')
    .startAt(new Date(Date.now() - 1000000).getTime())
    .on('child_added', (snapshot) => {
      const value = snapshot.val()
      if (value) {
        const message = [...this.state.message]
        const {msg, name: author} = value
        message.push({msg, author})
        this.setState({message})
        console.log(value)
      }
    })
  }
  
  componentWillUpdate(nextProps, nextState) {
    if (nextState.message !== this.state.message) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextState.message)
      })
    }
  }

  render () {
    return (
      < ListView
        enableEmptySections={true}
        style={styles.chatContainer}
        dataSource={this.state.dataSource}
        renderRow={({author, msg}) => < Message author={author} msg={msg} />}
      />
    )
  }
}

export default class App extends Component {
  render() {
    return (
      < View style={styles.appContainer}>
        < Text style={styles.welcome}>
          Welcome to React Native!
        < /Text>
        < ChatExample />
      < /View>
    )
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  chatContainer: {
    marginTop: 10,
    marginRight: 5,
    marginLeft: 5
  },
  messageContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    marginBottom: 10
  },
  messageAuthor: {
    flex: 0.2,
    fontWeight: 'bold',
    marginRight: 5
  },
  messageText: {
    flex: 1,
    fontStyle: 'italic',
    textAlign: 'justify',
    marginRight: 5
  },
  welcome: {
    color: 'white',
    backgroundColor: 'rgb(245, 123, 45)',
    fontSize: 20,
    textAlign: 'center',
    padding: 15,
    margin: 0,
  }
})

