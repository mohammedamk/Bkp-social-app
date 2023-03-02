import React, {Component} from "react";
import {Image, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import RF from "react-native-responsive-fontsize";

import Layout from "../constants/Layout";
import {WebBrowser} from 'expo';
import EventDetailsHiddenItemsComponent from "../components/EventDetailsHiddenItemsComponent";
import ReportEventComponent from "../components/ReportEventComponent";

const SCREEN_HEIGHT = Layout.window.height;
const SCREEN_WIDTH = Layout.window.width;

export default class EventDetailsScreen extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const dayNames = ["MON", "TUES", "WED", "THUR", "FRI", "SAT", "SUN"];

        const event = this.props.navigation.getParam('event');
        const isSongkick = this.props.navigation.getParam('isSongkick');

        this.state = {
            isSongkick: isSongkick,
            eventHostName: isSongkick ? event['performance'][0]['artist']['displayName'] : event['owner']['first'],
            eventDescription: isSongkick ? event['displayName'] : event['detail'],
            eventTitle: isSongkick ? event['displayName'] : event['name'],
            eventDay: isSongkick ? dayNames[new Date(event['start']['date']).getDay()] : dayNames[new Date(event['start']).getDay()],
            eventTime: isSongkick ? this._formatTimeforSongKick(event['start']['time']) : this._formatAMPM(new Date(event['start'])),
            eventDate: isSongkick ? monthNames[event['start']['date'].split('-')[1] - 1] + ' ' + event['start']['date'].split('-')[2]
                : monthNames[new Date(event['start']).getMonth()] + ' ' + new Date(event['start']).getDate(),
            eventHostPhoto: isSongkick ? {uri: 'https://images.sk-static.com/images/media/profile_images/artists/' + event['performance'][0]['artist']['id'] + '/huge_avatar'} : {uri: event['owner']['photo1_url']},
            guestNums: isSongkick ? 0 : event['guests'].length,
            eventAway: '2.5 km',
            eventAddress: isSongkick ? event['venue']['displayName'] : event['location_name'],
            eventWebsite: isSongkick ? event['uri'] : event['website'] ? event['website'] : 'No website',
            eventGuests: isSongkick ? [] : event['guests'],
            eventOwner: isSongkick ? {} : event['owner'],
            groupChatRoomId: isSongkick ? 0 : event['group_chat_room_id'],
            isModalVisible: false
        };

        this.toggleModal = this.toggleModal.bind(this);
    }

    _formatTimeforSongKick = (time) => {
        if (time) {
            let timeArr = time.split(':');
            if (timeArr[0] > 12) {
                let hour = timeArr[0] - 12;
                return hour + ':' + timeArr[1] + ' PM';
            } else {
                return timeArr[0] + ':' + timeArr[1] + ' AM'
            }
        }
    };

    _formatAMPM = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    };

    _handlePressSlack = () => {
        if (this.state.eventWebsite !== 'No website') {
            WebBrowser.openBrowserAsync(this.state.eventWebsite);
        }
    };

    toggleModal() {
        this.setState({
            isModalVisible: !this.state.isModalVisible
        })
    }

    renderGuests = () => {
        return this.state.eventGuests.slice(0, 4).map((item, i) => {
            return (
                <View key={i} style={styles.guestPicThumbnailContainer}>
                    <Image
                        source={{uri: item['photo1_url']}}
                        style={styles.guestPicThumbnail}
                    />
                    <Text style={styles.guestName}> {item['first']} </Text>
                </View>
            )
        })
    }

    render() {
        const eventConfirmed = this.props.navigation.getParam('eventConfirmed');
        const trimTitle = (this.state.eventTitle).split('(')
        return (
            <ImageBackground style={styles.background} source={require('../assets/Pngs/bg.imageset/bg.png')}>
                <StatusBar />
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image
                            source={require('../assets/Icons/go-back-left-arrow/go-back-left-arrow.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerText}> {trimTitle[0]} </Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.profilePicContainer}>
                        <View style={styles.profileContainer}>
                            {!this.state.isSongkick ?
                                <TouchableOpacity style={{marginRight: -45, width: 39, zIndex: 1}}
                                                  onPress={() => this.props.navigation.navigate('Profile', {
                                                      message: eventConfirmed,
                                                      profileInfo: this.state.eventOwner
                                                  })}>
                                    <Image
                                        source={require('../assets/Icons/account.imageset/account.png')}
                                        style={{zIndex: 1}}
                                    />
                                </TouchableOpacity>
                                : <View/>}


                            <Image
                                source={this.state.eventHostPhoto}
                                style={styles.eventDetailsHostPic}
                            />
                            {eventConfirmed && !this.state.isSongkick ?
                                <TouchableOpacity
                                    style={{marginLeft: -40, zIndex: 1, width: 39}}
                                    onPress={() => this.props.navigation.navigate('ChatRoom', {
                                        groupChatRoomId: this.state.groupChatRoomId
                                    })}>
                                    <Image
                                        source={require('../assets/Icons/chatting.imageset/chatting.png')}
                                        style={{zIndex: 1}}
                                    />
                                </TouchableOpacity>
                                : <View/>
                            }

                        </View>
                        <View style={styles.hostDetailsContainer}>
                            <Text style={styles.eventDetailsHostName}> {this.state.eventHostName} </Text>
                            <Text style={styles.eventDetailsHostName2}> Host </Text>
                        </View>
                    </View>
                    <View style={styles.eventDetailsContainer}>
                        <View style={styles.eventDetailsItemContainer}>
                            <View style={styles.eventDetailIcons}>
                                <Image
                                    source={require('../assets/Icons/event_detail.imageset/event_detail.png')}
                                />
                            </View>

                            <View style={styles.textDetailsContainer}>
                                <Text style={styles.eventDetailsText}> {this.state.eventDescription} </Text>
                                <View style={styles.divider}/>
                            </View>
                        </View>
                        <View style={styles.eventDetailsItemContainer}>
                            <View style={styles.eventDetailIcons}>
                                <Image
                                    source={require('../assets/Icons/event_date.imageset/event_date.png')}
                                />
                            </View>
                            <View style={styles.textDetailsContainer}>
                                <Text style={styles.eventDetailsText}>
                                    Saturday, September 26 {"\n"}
                                    at 9:00pm to 5:00am
                                </Text>
                                <View style={styles.divider}/>
                            </View>
                        </View>

                        {eventConfirmed ?
                            <View>
                                <View style={styles.eventDetailsItemContainer}>
                                    <View style={styles.eventDetailIcons}>
                                        <Image
                                            source={require('../assets/Icons/event_away.imageset/event_away.png')}
                                        />
                                    </View>
                                    <View style={styles.textDetailsContainer}>
                                        <View style={styles.eventDetailsClickableItem}>
                                            <Text style={styles.eventDetailsText}>
                                                {this.state.eventAddress}
                                            </Text>
                                            <Image
                                                source={require('../assets/Icons/rightArrow.imageset/rightArrow.png')}
                                            />
                                        </View>
                                        <View style={styles.divider}/>
                                    </View>
                                </View>
                                {!this.state.isSongkick ?
                                    <View style={styles.eventDetailsItemContainer}>
                                        <View style={styles.eventDetailIcons}>
                                            <Image
                                                source={require('../assets/Icons/group_chat.imageset/gc2.png')}
                                                style={{width: 20, height: 20}}
                                            />
                                        </View>
                                        <View style={styles.textDetailsContainer}>
                                            <TouchableOpacity
                                                onPress={() => this.props.navigation.navigate('ChatRoom')}>
                                                <View style={styles.eventDetailsClickableItem}>
                                                    <Text style={styles.eventDetailsText}>
                                                        Group Chat
                                                    </Text>

                                                    <View style={{
                                                        flexDirection: 'row',
                                                        flex: 1,
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center'
                                                    }}>
                                                        <View style={styles.msgAlert}>
                                                            <Text style={styles.alertNum}> 2 </Text>
                                                        </View>
                                                        <Image
                                                            source={require('../assets/Icons/rightArrow.imageset/rightArrow.png')}/>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.divider}/>
                                        </View>
                                    </View> : <View/>}
                                {this.state.eventWebsite != 'No website' && <View style={styles.eventDetailsItemContainer}>
                                                                    <View style={styles.eventDetailIcons}>
                                                                        <Image
                                                                            source={require('../assets/Icons/event_website.imageset/safari40.png')}
                                                                            style={{width: 20, height: 20}}
                                                                        />
                                                                    </View>
                                                                    <View style={styles.textDetailsContainer}>
                                                                        <TouchableOpacity onPress={this._handlePressSlack}>
                                                                            <View style={styles.eventDetailsClickableItem}>
                                                                                <Text style={styles.eventDetailsText}>
                                                                                {this.state.eventWebsite}
                                                                                </Text>
                                                                                <Image
                                                                                source={require('../assets/Icons/rightArrow.imageset/rightArrow.png')}/>
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                        <View style={styles.divider}/>
                                                                    </View>
                                                                </View>}
                                {!this.state.isSongkick ?
                                    <View style={styles.eventDetailsItemContainer}>
                                        <View style={styles.eventDetailIcons}>
                                            <Image
                                                source={require('../assets/Icons/event_host.imageset/event_host.png')}
                                            />
                                        </View>
                                        <View style={styles.textDetailsContainer}>
                                            <TouchableOpacity
                                                onPress={() => this.props.navigation.navigate('GuestsList', {
                                                    guests: this.state.eventGuests
                                                })}>
                                                <View style={styles.eventDetailsClickableItem}>

                                                    <Text style={styles.eventDetailsText}>
                                                        Confirmed Guests
                                                    </Text>

                                                    <Image
                                                        source={require('../assets/Icons/rightArrow.imageset/rightArrow.png')}/>

                                                </View>
                                            </TouchableOpacity>

                                            <View style={styles.guestPicsContainer}>
                                                {this.renderGuests()}
                                            </View>
                                            <View style={styles.divider}/>
                                        </View>
                                    </View> : <View/>}
                                <View style={styles.eventDetailsItemContainer}>
                                    <View style={styles.eventDetailIcons}>
                                        <Image
                                            source={require('../assets/Icons/event_report.imageset/event_report.png')}
                                        />
                                    </View>
                                    <View style={styles.textDetailsContainer}>
                                        <TouchableOpacity
                                            style={styles.eventDetailsClickableItem}
                                            onPress={this.toggleModal}
                                        >
                                            <Text style={styles.eventDetailsText}>
                                                Report Event
                                            </Text>
                                            <Image
                                                source={require('../assets/Icons/rightArrow.imageset/rightArrow.png')}/>
                                        </TouchableOpacity>
                                        <View style={styles.divider}/>
                                    </View>
                                </View>
                            </View>
                            :
                            <EventDetailsHiddenItemsComponent isSongkick={this.state.isSongkick} website={this.state.eventWebsite}/>
                        }
                        <ReportEventComponent isModalVisible={this.state.isModalVisible}/>
                    </View>
                </ScrollView>
            </ImageBackground>
        );

    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%'
    },
    icon: {
        width: 20,
        height: 20,
        margin: SCREEN_WIDTH * 0.053
    },
    headerText: {
        fontSize: RF(3.5),
        color: 'white',
        fontFamily: 'Roboto'
    },
    profilePicContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.4403125,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    eventDetailsHostPic: {
        width: SCREEN_HEIGHT * 0.24,
        height: SCREEN_HEIGHT * 0.24,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomRightRadius: 100,
        borderBottomLeftRadius: 100
    },
    profilePicContentContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    eventDetailsHostName: {
        fontFamily: 'Roboto',
        fontSize: RF(3.8),
        color: '#535151'
    },
    eventDetailsHostName2: {
        fontFamily: 'Roboto',
        fontSize: RF(2.7),
        color: '#535151'
    },
    eventDetailsContainer: {
        backgroundColor: '#F2F3F4',
        width: '100%'
    },
    eventDetailsItemContainer: {
        width: SCREEN_WIDTH,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
    },
    textDetailsContainer: {
        width: SCREEN_WIDTH * 0.85,
        paddingLeft: 5
    },
    divider: {
        borderBottomColor: '#cacbcc',
        borderBottomWidth: 1,
        marginTop: 20,
        marginBottom: -20,
        width: '100%'
    },
    eventDetailsText: {
        color: '#8F8E94',
        fontSize: RF(2.4),
        fontFamily: 'Roboto',

    },
    eventDetailsClickableItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    msgAlert: {
        width: 27,
        height: 27,
        borderRadius: 24,
        backgroundColor: '#E3422A',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertNum: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Roboto'
    },
    guestPicsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        marginLeft:'-12%',
    },
    guestPicThumbnail: {
        width: '100%',
        height: SCREEN_HEIGHT * 0.099375,
        borderRadius: 4,
        marginTop: 24,
        borderWidth: 1,
        borderColor: 'rgba(250, 250, 250, 0.5)'
    },
    guestPicThumbnailContainer: {
        //flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 10,
        width: '25%',
        //height: SCREEN_HEIGHT * 0.099900,

    },
    guestName: {
        color: '#8C8C8C',
        fontFamily: 'Roboto',
        fontSize: 11
    },
    profileMsgContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        width: '40%',
        marginLeft: 70,
        marginTop: -100
    },
    profileContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'baseline',
        padding: 30
    },
    hostDetailsContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    eventDetailIcons: {
        width: SCREEN_WIDTH * 0.15,
        marginTop: 5,
        paddingHorizontal: 5
    }
});
