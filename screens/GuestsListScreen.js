import React, {Component} from 'react';
import {Dimensions, FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const window = Dimensions.get('window')

export default class GuestsListScreen extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor() {
        super();
        this.state = {
            guestsListData: [],

        }
    }

    componentWillMount() {
        this.setState({
            guestsListData: this.props.navigation.getParam('guests')
        });
        console.log('This is working')
    }

    displayGuestsList = ({item}) => {
        return (
            <View style={{height: window.height / 8, flexDirection: 'column'}}>
                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', flex: 60}}
                                  onPress={() => this.props.navigation.navigate('Profile', {
                                      message: false,
                                      profileInfo: item
                                  })}
                >
                    <View style={{flex: 2, alignItems: 'center'}}>
                        <View style={{width: window.width / 7, height: window.width / 7}}>
                            <Image
                                style={{width: '100%', height: '100%', borderRadius: window.width, resizeMode: 'cover'}}
                                source={{uri: item['photo1_url']}}/>
                        </View>
                    </View>
                    <View style={{flex: 5, alignItems: 'flex-start'}}>
                        <Text style={{
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                            fontSize: window.height / 40
                        }}>{item['first'] + ' ' + item['last']}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Image style={{width: window.height / 45, height: window.height / 45, resizeMode: 'contain'}}
                               source={require('../assets/Icons/rightArrow.imageset/rightArrow.png')}/>
                    </View>
                </TouchableOpacity>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <View style={{flex: 1, backgroundColor: '#A9A9A9', width: '95%'}}></View>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 1}}>
                    <ImageBackground
                        source={require('../assets/Pngs/bg.imageset/bg.png')}
                        style={{width: "100%", height: "100%"}}
                    >
                        <View style={styles.container}>
                            <View style={styles.headerContainer}>
                                <View style={{flex: 1, alignItems: 'center'}}>
                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                        <Image style={{
                                            width: window.height / 25,
                                            height: window.height / 25,
                                            resizeMode: 'contain'
                                        }}
                                               source={require('../assets/Icons/go-back-left-arrow/go-back-left-arrow.png')}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 5, alignItems: 'flex-start',}}>
                                    <Text style={{color: 'white', fontSize: window.height / 40}}>Confirmed Guests</Text>
                                </View>
                                <View style={{flex: 1, alignItems: 'center'}}>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('GuestsListEdit', {guests: this.state.guestsListData})}>
                                        <Text style={{color: 'yellow', fontSize: window.height / 40}}>Edit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flex: 9, backgroundColor: 'white'}}>
                                <FlatList
                                    data={this.state.guestsListData}
                                    renderItem={this.displayGuestsList}
                                    numColumns={1}
                                    keyExtractor={(item, index) => item['user_id'].toString()}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </View>
        );
    }
}


styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    guestsList: {
        flex: 9,
        backgroundColor: 'white',
    },
    guest: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 60,
    }
})
