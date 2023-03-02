import React, {Component} from 'react';
import {GiftedChat} from 'react-native-gifted-chat'
import {Dimensions, Image, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const window = Dimensions.get('window')

export default class DirectMessageScreen extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            messages:[],

        }
    }

    componentWillMount() {
        this.setState({
          messages: [
              {
                _id: 1,
                text: 'Are we still having that afternoon party tonight?',
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: 'Karl Nyland',
                  avatar: 'https://placeimg.com/140/140/any',
                },
              },
          ],
        })
      }
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
        console.log(this.state.messages)
    }

    render() {
        return(
            <View style={{flex:1}}>
            <StatusBar />
                <ImageBackground
                    source={require('../assets/background.png')}
                    style={{ width: "100%", height: "100%" }}
                >
                    <View style={styles.container}>
                        <View style={styles.headerContainer}>
                            <View style={{flex:1, alignItems:'center'}}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                    <Image style={{width:window.height/25, height:window.height/25, resizeMode:'contain'}} source={require('../assets/Icons/go-back-left-arrow/go-back-left-arrow.png')}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:5, alignItems:'flex-start',}}>
                                <Text style={{color:'white', fontSize:window.height/40}}>Quentin</Text>
                            </View>
                        </View>
                        <View style={styles.messagesList}>
                            <GiftedChat
                                messages={this.state.messages}
                                onSend={messages => this.onSend(messages)}
                                user={{
                                _id: 1,
                                name: 'Quentin',
                                avatar:'https://images.pexels.com/photos/658687/pexels-photo-658687.jpeg?auto=compress&cs=tinysrgb&h=350'
                                }}
                                onPressAvatar = {(user) => {
                                    this.props.navigation.navigate('Profile', {
                                        message:false
                                    })
                                }}
                            />
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}

styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
    },
    headerContainer:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
    },
    messagesList:{
        flex:9,
        backgroundColor:'white',
    },
    message:{
        flexDirection:'row',
        alignItems:'center',
        flex:60,
    }
})
