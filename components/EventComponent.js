import React, {Component} from 'react'
import {Image, StyleSheet, Text, View} from 'react-native';
import Layout from "../constants/Layout";
import RF from "react-native-responsive-fontsize"

const SCREEN_HEIGHT = Layout.window.height;
const SCREEN_WIDTH = Layout.window.width;
const PICTURES_PATH = "../assets/Pngs/";

export default class EventComponent extends Component {
    constructor(props) {
        super(props);

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const dayNames = ["MON", "TUES", "WED", "THUR", "FRI", "SAT", "SUN"];
        if (!props.isSongkick){
            // console.log(props.event['owner'])
        }
        this.state = {
            eventHostName: props.isSongkick ? props.event['venue']['displayName'] : props.event['owner']['first'],
            eventTitle: props.isSongkick ? this._formatEventTitle(props.event['displayName']) : props.event['name'],
            eventDay: props.isSongkick ? dayNames[new Date(props.event['start']['date']).getDay()] : dayNames[new Date(props.event['start']).getDay()],
            eventTime: props.isSongkick ? this._formatTimeforSongKick(props.event['start']['time']) : this._formatAMPM(new Date(props.event['start'])),
            eventDate: props.isSongkick ? monthNames[props.event['start']['date'].split('-')[1] - 1] + ' ' + props.event['start']['date'].split('-')[2]
                : monthNames[new Date(props.event['start']).getMonth()] + ' ' + new Date(props.event['start']).getDate(),
            eventHostPhoto: props.isSongkick ? {uri: 'https://images.sk-static.com/images/media/profile_images/artists/' + props.event['performance'][0]['artist']['id'] + '/huge_avatar'}
            : {uri: props.event['owner']['photo1_url']},
            guestNums: props.isSongkick ? 0 : props.event['guests'].length,
            eventAway: '2.5 km',
            eventConfirmed: props.eventConfirmed,
            isCurrentUserHost: props.isCurrentUserHost
        };

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isSongkick: nextProps.isSongkick,
            event: nextProps.event
        })
    }

    _getRad = (x) => {
        return x * Math.PI / 180
    };

    _getDistanceAway = (dest) => {
        // let origin = this._getCurrentLocaiton();
        // var R = 6378137; // Earth’s mean radius in meter
        // var dLat = this._getRad(dest.lat - origin.lat);
        // var dLong = this._getRad(dest.long - origin.long);
        // var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        //     Math.cos(this._getRad(origin.lat())) * Math.cos(this._getRad(dest.lat())) *
        //     Math.sin(dLong / 2) * Math.sin(dLong / 2);
        // var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        // var d = R * c;
        // return d / 1000; // returns the distance in km
        return 0;
    };


    _formatEventTitle = (fullTitle) => {
        fullTitle = fullTitle.split('at');
        return fullTitle[0];
    };

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

    render() {
        return (
            <View style={{width: '100%', height: '100%'}}>
                <View style={styles.cardHeader}>
                    {this.state.eventConfirmed ?
                        this.state.isCurrentUserHost ?
                            <View style={styles.hostPicContainer}>
                                <View style={styles.dummyStatus}>
                                    <Text style={{color: 'white'}}>{'             '}</Text>
                                </View>
                                <Image
                                    source={this.state.eventHostPhoto}
                                    style={styles.hostPic}
                                    resizeMode="cover"
                                />
                                <View style={styles.notifStatus3}>
                                    <Text style={{color: 'white'}}>{'  '}Host{'  '}</Text>
                                </View>
                            </View>
                            :
                            <View style={styles.hostPicContainer}>
                                <View style={styles.notifStatus1}>
                                    <Text style={{color: 'white'}}>Updated</Text>
                                </View>
                                <Image
                                    source={this.state.eventHostPhoto}
                                    style={styles.hostPic}
                                    resizeMode="cover"
                                />
                                <View style={styles.notifStatus2}>
                                    <Text style={{color: 'white'}}>Confirm</Text>
                                </View>
                            </View>

                        :
                        <View style={styles.hostPicContainer}>
                            <Image
                                source={this.state.eventHostPhoto.uri && this.state.eventHostPhoto.uri.length > 0 ? this.state.eventHostPhoto :
                                    {uri: 'http://deafhhcenter.org/wp-content/uploads/2017/12/profile-default.jpg'}}
                                style={styles.hostPic}
                                resizeMode="cover"
                            />
                        </View>
                    }

                </View>
                <View style={styles.card}>
                    <View style={styles.details}>
                        <Text style={styles.hostName}>{this.state.eventHostName}</Text>
                        <View style={styles.divider}/>
                        <Text style={styles.subheading}>Host</Text>
                        
                        <View style={{
                            marginBottom: 10
                        }}>
                            <Text style={styles.eventTitle}>{this.state.eventTitle}</Text>
                        </View>
                        <Text style={styles.heading1}> {this.state.eventDay}, {this.state.eventTime}</Text>
                        <Text style={styles.eventDate}> {this.state.eventDate} </Text>
                    </View>
                    <View style={styles.cardFooter}>
                        <Text style={{fontFamily: 'sans-serif-thin', fontSize: RF(2)}}>
                            <Image style={{
                                width: 30,
                                height: 30,
                                marginRight: 20,
                                resizeMode: 'contain'
                            }}
                                   source={require('../assets/Icons/guest.imageset/guest.png')}/>
                            {' ' + this.state.guestNums + ' '} Guests
                        </Text>
                        <Text style={{fontFamily: 'sans-serif-thin', fontSize: RF(2)}}>
                            <Image style={{
                                width: 30,
                                height: 30,
                                marginLeft: -20,
                                resizeMode: 'contain'
                            }}
                                   source={require('../assets/Icons/away.imageset/away.png')}/>
                            2.5 Miles away
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardHeader: {
        width: SCREEN_WIDTH * 0.8722,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        // flex: 1,
        marginTop: -SCREEN_WIDTH * 0.2,
        backgroundColor: 'white',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: SCREEN_WIDTH * 0.8722,
        height: SCREEN_HEIGHT * 0.5234375,
        // zIndex: 0,
         borderRadius: 6
    },
    details: {
        paddingTop: SCREEN_WIDTH * 0.1,
        marginTop: -SCREEN_WIDTH * 0.06,
        alignItems: 'center',
        width: '100%',
        height: '110%',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
        // backgroundColor: 'orange',
        borderRadius: 5
    },
    cardFooter: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingLeft: SCREEN_WIDTH / 28,
        paddingRight: SCREEN_WIDTH / 28,
        position: 'absolute',
        bottom: 26,
        borderRadius: 6,

    },
    hostPicContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: SCREEN_WIDTH * 0.4,
        flexDirection: 'row',
        top: 0
    },
    hostPic: {
        width: SCREEN_WIDTH * 0.35678,
        height: SCREEN_WIDTH * 0.38567,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderTopLeftRadius: 80,
        borderTopRightRadius: 80,
        borderWidth: 3,
        borderColor: '#fff',
        zIndex: 1
    },
    hostName: {
        fontFamily: 'sans-serif-thin',
        fontSize: RF(3.5)
    },
    subheading: {
        fontFamily: 'sans-serif-thin',
        fontSize: RF(2)
    },
    eventTitle: {
        fontFamily: 'Roboto',
        fontSize: RF(4),
        fontWeight: 'bold',
        textAlign: 'center'
    },
    heading1: {
        fontFamily: 'Roboto',
        fontSize: RF(3.7)
    },
    eventDate: {
        fontFamily: 'sans-serif-thin',
        fontSize: RF(2.2)
    },
    divider: {
        borderBottomColor: '#f1f1f1',
        borderBottomWidth: 1,
        width: '30%',
        marginTop: SCREEN_HEIGHT * 0.01,
        marginBottom: SCREEN_HEIGHT * 0.01
    },
    notifStatus1: {
        backgroundColor: '#E3422A',
        borderRadius: 50,
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        paddingRight: 15,
        paddingLeft: 15,
        marginTop: 40
    },
    notifStatus2: {
        backgroundColor: '#8cbc45',
        borderRadius: 50,
        margin: 5,
        alignItems: 'center',
        zIndex: 10,
        paddingRight: 15,
        paddingLeft: 15,
        marginTop: 40
    },
    notifStatus3: {
        backgroundColor: '#00b9f3',
        borderRadius: 50,
        margin: 5,
        alignItems: 'center',
        zIndex: 10,
        paddingRight: 15,
        paddingLeft: 15,
        marginTop: 40
    },
    dummyStatus: {
        borderRadius: 50,
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        paddingRight: 15,
        paddingLeft: 15,
        marginTop: 40
    },
});
