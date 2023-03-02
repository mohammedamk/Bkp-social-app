import React from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native';
import DateTimeComponent from './DateTimeComponent';
import Layout from '../constants/Layout';
import { bindActionCreators } from "redux";
import { createEvent } from "../actions/eventsActions";
import connect from "react-redux/es/connect/connect";

const SCREEN_HEIGHT = Layout.window.height;
const SCREEN_WIDTH = Layout.window.width;

export class EventCreationComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: 'Location',
            title: '',
            ownerid: 202,
            startDatetime: null,
            startDate: null,
            startTime: null,
            startDayOfWeek: null,
            endDatetime: null,
            endDate: null,
            endTime: null,
            endDayOfWeek: null,
            website: null,
            eventInfo: null,
            showAlert: false,
            badDate : false,
        }
        this.handleBadDate = this.handleBadDate.bind(this);
    }

    static navigationOptions = {
        header: null,
    };

    handleBadDate(param) {
        if (param) {
            this.setState({badDate : true,})
        } else {
            this.setState({badDate: false,})
        }
    }



    closeComponent = () => {
        console.log('closing');
        this.props.close();
        console.log('closing2');
    };

    create = () => {
        this.getDateTimeState();
        this.props.createEvent(this.state);
        this.closeComponent();
    };

    returnData(theData, locationName) {
        this.setState({ data: theData, location: locationName });
    }


    onPressEvent = () => {
        const datetime = this.DateTimeComponent.getDateTimeState();
        console.log('badDate is' + this.state.badDate);
        if (!this.state.title || this.state.title.length === 0) {
            console.log('Title Length');
            this.props.openModal()
        } else if (this.state.location === 'Location') {
            console.log('Location');
            this.props.openModal()
        } else if (!datetime || !datetime.startDate || !datetime.endDate || !datetime.startTime || !datetime.endTime) {
            console.log('noDateTime');
            this.props.openModal()
        } else if (!this.state.eventInfo || this.state.eventInfo.length <= 1) {
            console.log('evInf');
            this.props.openModal()
        } else if(this.state.badDate){

            this.props.openModal('End Date must be after Start Date.')
        } else {
            Alert.alert(
                '',
                'By accepting the terms you accept all liabilities and repercussions done to you or by you at any event in connection / relation through Rendevous presently or in the future.',
                [
                    { text: 'Accept', onPress: () => this.create() },
                    { text: 'Deny', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                ],
                { cancelable: false }
            )
        }
    };

    getDateTimeState = () => {
        const datetime = this.DateTimeComponent.getDateTimeState();
        this.setState({
            startDatetime: datetime.startDatetime,
            startDate: datetime.startDate,
            startTime: datetime.startTime,
            startDayOfWeek: datetime.startDayOfWeek,
            endDatetime: datetime.endDatetime,
            endDate: datetime.endDate,
            endTime: datetime.endTime,
            endDayOfWeek: datetime.endDayOfWeek,
        })

    };

    // locationColor = () => {
    //     var theColor = '#8e8e93';
    //     console.log(this.state.title);
    //     if (this.state.title != 'Location') {
    //         theColor = 'black';
    //     }
    //     return theColor;
    // }
    render() {
        return (
            <View style={styles.outer}>
                {/* <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * (722 / 493), }}> */}
                <View style={{
                    backgroundColor: 'transparent',
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT * (50 / 722)
                }}></View>
                <TouchableNativeFeedback onPress={() => this.closeComponent()}>

                    <Image style={{ marginBottom: -2 }}
                        source={require('../assets/Icons/pull-up-notch-with-arrow/notch_small.png')} />

                </TouchableNativeFeedback>
                <View style={{
                    height: SCREEN_HEIGHT * (672 / 722),
                    width: SCREEN_WIDTH,
                    flexDirection: 'column',
                    backgroundColor: '#f2f3f4',
                    borderTopLeftRadius: SCREEN_WIDTH * (10 / 360),
                    borderTopRightRadius: SCREEN_WIDTH * (10 / 360)
                }}>
                    <View style={{
                        height: SCREEN_HEIGHT * (54 / 722),
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            marginLeft: SCREEN_WIDTH * (17 / 360),
                            fontSize: SCREEN_HEIGHT * (14 / 722),
                            color: 'black'
                        }}>
                            {this.props.title}
                        </Text>
                        <TouchableOpacity onPress={() => this.closeComponent()} style={{
                            backgroundColor: 'transparent',
                            marginRight: SCREEN_WIDTH * (15 / 360),
                            marginTop: SCREEN_HEIGHT * (16 / 722),
                            marginBottom: SCREEN_HEIGHT * (16 / 722)
                        }}>
                            <Image style={{ resizeMode: 'cover' }}
                                source={require('../assets/Icons/close.imageset/close.png')} />
                        </TouchableOpacity>

                    </View>

                    <View style={{ height: SCREEN_HEIGHT * (43 / 722), flexDirection: 'row' }}>
                        <TextInput onChangeText={(value) => this.setState({ title: value })} maxLength={60} multiline={false}
                            placeholderTextColor='#8e8e93' underlineColorAndroid='rgba(0,0,0,0)' style={{
                                paddingLeft: SCREEN_WIDTH * (17 / 360),
                                flex: 1,
                                backgroundColor: 'white',
                                fontSize: SCREEN_HEIGHT * (11 / 722),
                                borderBottomWidth: 0.5,
                                borderTopWidth: 0.5,
                                borderColor: 'rgba(0,0,0, 0.1)'
                            }} fontFamily='Roboto' placeholder='Title' />
                    </View>

                    <TouchableOpacity
                        style={{
                            height: SCREEN_HEIGHT * (43 / 722),
                            backgroundColor: 'white',
                            borderBottomWidth: 0.5,
                            borderTopWidth: 0.5,
                            borderColor: 'rgba(0,0,0, 0.1)',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                        onPress={() => this.props.navigation.navigate('Map', { returnData: this.returnData.bind(this) })}
                    >
                        <Text
                            style={this.state.location === 'Location' ? styles.grey : styles.black}>{this.state.location}</Text>
                        <Image style={{ marginRight: SCREEN_WIDTH * (16 / 360) }}
                            source={require('../assets/Icons/navigation-filled/navigation.png')} />
                    </TouchableOpacity>

                    <View style={{ height: SCREEN_HEIGHT * (36 / 722), width: SCREEN_WIDTH, backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{
                            marginVertical: SCREEN_HEIGHT * (8 / 722),
                            marginLeft: SCREEN_WIDTH * (17 / 360),
                            marginRight: SCREEN_WIDTH * (12 / 360)
                        }} source={require('../assets/Icons/event_away_lock.imageset/event_away_lock.png')} />
                        <Text style={{ marginVertical: SCREEN_HEIGHT * (11 / 722), fontSize: SCREEN_HEIGHT * (11 / 722) }}>Location is private until guest is
                            confirmed</Text>
                    </View>


                    <DateTimeComponent {...this.state}
                        handleBadDate={this.handleBadDate}
                        ref={instance => {
                            this.DateTimeComponent = instance
                        }} />

                    {/* <Text>Ends</Text> */}

                    <View style={{ height: SCREEN_HEIGHT * (36 / 722), width: SCREEN_WIDTH, backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center' }}>
                    </View>

                    {/* <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'white', marginBottom: 40, marginTop: 40, justifyContent: 'center'}}> */}

                    <TextInput
                        autoCorrect={false}
                        textContentType='URL'
                        onChangeText={(value) => this.setState({ website: value })}
                        multiline={false}
                        placeholderTextColor='#8e8e93'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        style={{
                            height: SCREEN_HEIGHT * (43 / 722),
                            backgroundColor: 'white',
                            fontSize: SCREEN_HEIGHT * (11 / 722),
                            paddingLeft: SCREEN_WIDTH * (17 / 360),
                            borderBottomWidth: 0.5,
                            borderTopWidth: 0.5,
                            borderColor: 'rgba(0,0,0, 0.1)'
                        }}
                        fontFamily='Roboto'
                        placeholder='Website (Optional)' />
                    {/* <Text style={{ fontSize: 18, color: '#8e8e93', marginLeft: 15 }} fontFamily='Roboto'>Contact Info (Optional)</Text> */}
                    <View style={{ height: SCREEN_HEIGHT * (36 / 722), width: SCREEN_WIDTH, backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center' }}>
                    </View>
                    <View style={{
                        height: SCREEN_HEIGHT * (101 / 722),
                        backgroundColor: 'white',
                        borderTopWidth: 0,
                        paddingTop: SCREEN_HEIGHT * (17 / 722)
                    }}>
                        <TextInput enablesReturnKeyAutomatically={false} onChangeText={(value) => this.setState({ eventInfo: value })} multiline={true}
                            placeholderTextColor='#8e8e93' underlineColorAndroid='rgba(0,0,0,0)' style={{
                                paddingLeft: SCREEN_WIDTH * (17 / 360),
                                fontSize: SCREEN_HEIGHT * (11 / 722)
                            }} fontFamily='Roboto' placeholder='Tell us about your event' />
                    </View>
                    <TouchableOpacity onPress={
                        () => this.props.navigation.navigate('Invite')
                    } style={{
                        paddingVertical: SCREEN_HEIGHT * (26 / 722),
                        paddingHorizontal: SCREEN_WIDTH * (34 / 360),
                        height: SCREEN_HEIGHT * (80 / 722),
                        backgroundColor: 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: SCREEN_HEIGHT * (38 / 722),
                            width: SCREEN_WIDTH * (291 / 360),
                            borderColor: 'black',
                            borderWidth: 0.3
                        }}>
                            <Text style={{ fontSize: SCREEN_HEIGHT * (11 / 722), color: 'black', textAlign: 'center' }}
                                fontFamily='Roboto'>Invite Friends</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableHighlight underlayColor='#433d62' onPress={() => this.onPressEvent()} style={{
                        height: SCREEN_HEIGHT * (75 / 722),
                        backgroundColor: '#fdd302',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontFamily: 'Roboto', fontSize: SCREEN_HEIGHT * (15 / 722), color: 'white', fontWeight: 'bold' }}
                            fontFamily='Roboto'>{this.props.buttonText}</Text>
                    </TouchableHighlight>


                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    outer: {
        flex: 1,
        // justifyContent: 'space-between',
        alignItems: 'center',
    },
    grey: {
        marginLeft: SCREEN_WIDTH * (17 / 360),
        fontSize: SCREEN_HEIGHT * (11 / 722),
        fontFamily: 'Roboto',
        color: "#8e8e93",
    },
    black: {
        marginLeft: SCREEN_WIDTH * (17 / 360),
        fontSize: SCREEN_HEIGHT * (11 / 722),
        fontFamily: 'Roboto',
        color: "black",
    },

});

const mapStateToProps = (state) => {
    const { events } = state;
    return { events }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        createEvent,
    }, dispatch)
);


export default connect(mapStateToProps, mapDispatchToProps)(EventCreationComponent);