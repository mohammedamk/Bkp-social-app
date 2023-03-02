import React, {Component} from 'react';
import {GiftedChat} from 'react-native-gifted-chat'
import {Dimensions, Image, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const window = Dimensions.get('window')

export default class ChatRoomScreen extends Component {

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
                _id: 4,
                text: 'Yep, cant wait',
                createdAt: new Date(),
                user: {
                  _id: 5,
                  name: 'Annie Hall',
                  avatar: 'https://placeimg.com/140/140/any',
                },
              },
              {
                _id: 3,
                text: 'Are you going to the afternoon party tonight?',
                createdAt: new Date(),
                user: {
                  _id: 4,
                  name: 'Jodee Furrow',
                  avatar: 'https://www.gettyimages.com/gi-resources/images/CreativeLandingPage/HP_Sept_24_2018/CR3_GettyImages-159018836.jpg',
                },
              },
              {
                _id: 2,
                text: 'Pretty good',
                createdAt: new Date(),
                user: {
                  _id: 3,
                  name: 'Ethel Wolfram',
                  avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSfpGcZfNOEMi5KxNb9tPlxzhY4BXZIFC8x1K4i1PbjjeFGnnJ',
                },
              },
              {
                _id: 1,
                text: 'Hey everyone! How are you guys?',
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: 'Karl Nyland',
                  avatar: 'https://www.irishtimes.com/polopoly_fs/1.2614603.1461003507!/image/image.jpg_gen/derivatives/box_620_330/image.jpg',
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
                                <Text style={{color:'white', fontSize:window.height/40}}>Hot Tub and Bear</Text>
                            </View>
                        </View>
                        <View style={styles.messagesList}>
                            <GiftedChat
                                messages={this.state.messages}
                                onSend={messages => this.onSend(messages)}
                                showUserAvatar = {true}
                                user={{
                                _id: 1,
                                name: 'Austin',
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
