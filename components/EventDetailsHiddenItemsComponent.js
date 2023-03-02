import React, {Component} from 'react'
import {Image, StyleSheet, Text, View} from 'react-native';
import Layout from "../constants/Layout";
import RF from "react-native-responsive-fontsize";


const SCREEN_HEIGHT = Layout.window.height;
const SCREEN_WIDTH = Layout.window.width;

export default class EventDetailsHiddenItemsComponent extends Component {

    constructor(props) {
        super(props);

        if (props.isSongkick) {
            this.state = {
                website: {
                    icon: require('../assets/Icons/event_website_lock/icon_3.png'),
                    value: props.website
                },
                location: {
                    icon: require('../assets/Icons/event_away_lock.imageset/event_away_lock.png'),
                    value: 'Address is locked till approved by host'
                },
            }
        } else {
            this.state = {
                location: {
                    icon: require('../assets/Icons/event_away_lock.imageset/event_away_lock.png'),
                    value: 'Address is locked till approved by host'
                },
                groupChat: {
                    icon: require('../assets/Icons/group_chat_lock/icon_2.png'),
                    value: 'Group chat is locked till approved by host'
                },
                website: {
                    icon: require('../assets/Icons/event_website_lock/icon_3.png'),
                    value: 'Website info is locked till approved by host'
                },
                guestsInfo: {
                    icon: require('../assets/Icons/event_host_lock.imageset/event_host_lock.png'),
                    value: 'Guests info is locked till approved by host'
                }
            }
        }


    }

    renderEventDetailsItems = () => {
        return Object.values(this.state).map((item, i) => {
            return (
                <View key={i} style={styles.eventDetailsItemContainer}>
                    <View style={styles.eventDetailIcons}>
                        <Image source={item.icon}/>
                    </View>
                    <View style={styles.textDetailsContainer}>
                        <Text style={styles.eventDetailsText}>
                            {item.value}
                        </Text>
                        <View style={styles.divider}/>
                    </View>
                </View>
            )
        })
    }


    render() {
        return (
            <View>
                {this.renderEventDetailsItems()}
            </View>
        )
    }

};
const styles = StyleSheet.create({
    eventDetailsItemContainer: {
        width: SCREEN_WIDTH,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 15,
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
    eventDetailIcons: {
        width: SCREEN_WIDTH * 0.15,
        marginTop: 5,
        paddingHorizontal: 5
    }
});