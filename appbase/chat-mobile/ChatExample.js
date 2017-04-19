import React, { Component } from 'react'
import { Text, View, ListView, StyleSheet } from 'react-native'
import Appbase from 'appbase-js'

/*
React Native is a great option for creating performant iOS and Android apps
that feel at home on their respective platforms.

For further details, feel free to take a look at the great RN documentation.
- https://facebook.github.io/react-native/docs/getting-started.html
**/
const ES_TYPE = 'chat'
const appbaseRef = new Appbase({
  url: 'https://scalr.api.appbase.io',
  appname: 'talks_2016',
  username: 'aWSlJvIUk',
  password: '58e3edd6-8933-4f61-a648-231c0404d4d7'
})

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
    // fetch all data under the type ES_TYPE
    appbaseRef.search({
      type: ES_TYPE,
      body: {
        query: {
          filtered: {
            filter: {
              range: {
                dt: {
                  gte: new Date(Date.now() - 1000000).getTime(),
                  lte: new Date(Date.now() + 1000000).getTime()
                }
              }
            }
          }
        }
      }
    }).on('data', (stream) => {
      const {
        hits: {
          hits = []
        } = {}
      } = stream || {};
      const list = hits.map(({_source = {}} = {}) => _source)
      this.setState({
        message: list.map(({name, msg}) => ({author: name, msg}))
      })
      list.forEach(console.log)
      console.log("searchStream(), new match: ", list)
    }).on('error', (error) => {
      console.log("caught a searchStream() error: ", error)
    })
    
    // keep watching the Elastic Search type ES_TYPE
    appbaseRef.searchStream({
      type: ES_TYPE,
      body: {
        query: {
          match_all: {}
        }
      }
    }).on('data', (stream) => {
      let {_deleted, _source} = stream
      if (!_deleted && _source) {
        const message = [...this.state.message]
        const {msg, name: author} = _source
        message.push({msg, author})
        this.setState({message})
        console.log(_source)
      }
      console.log("searchStream(), new match: ", stream)
    }).on('error', (error) => {
      console.log("caught a searchStream() error: ", error)
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

