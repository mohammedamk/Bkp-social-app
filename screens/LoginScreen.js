import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Dimensions, StatusBar, TouchableOpacity, BackHandler, AsyncStorage } from 'react-native';
import Swiper from 'react-native-swiper';
import WebBrowser from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { saveUserLogin, loadUserInfoFromLocal, loadUserInfoFromApi } from "../actions/userActions";


// TODO: implement backbutton prevention to login screen after logging in


class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bg: require('../assets/Pngs/bg.imageset/bg.png')
        }
    }

    // Hides navigation header
    static navigationOptions = {
        header: null,
    };

    // default url for TOS and privacy policy
    static defaultProps = {
        tos_url: 'http://www.rendevousapp.com/terms-of-service/',
        privacy_url: 'http://www.rendevousapp.com/privacy-policy/',
    }

    // Open link to in-app browser. Used in showing 'terms of use' and 'privacy policy'
    _openLink = async (link) => {
        await WebBrowser.WebBrowser.openBrowserAsync(link);
    }

    // Login with fb function for the fb login button
    loginWithFb = async () => {
        try {
            // Get fb permission and receive token
            const {
                type,
                token,
                expires,
                permissions,
                declinedPermissions,
            } = await Expo.Facebook.logInWithReadPermissionsAsync('1150503595061270', {
                permissions: ['public_profile', 'email', 'user_birthday', 'user_photos'],
            });

            // Token received = 'success' then fetch user info and fill user{},
            // then pass it to saveUserLogin to update redux state and save token to asyncstorage.
            if (type == 'success') {
                let response = await(await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,first_name,last_name,birthday,picture.type(large),email`)).json();
                //alert(JSON.stringify(response))
                let user = {
                    fbToken: token,
                    fbId: response.id,
                    first: response.first_name,
                    last: response.last_name,
                    email: response.email,
                    fbPic: response.picture.data.url
                }
                await this.props.saveUserLogin(user);
                let theUser = {
                    fbToken: token,
                    fbId: response.id,
                    sessiontoken: this.props.user.currentUser.sessiontoken,
                    fbPic: response.picture.data.url
                    // isNewUser: this.props.user.currentUser.isNewUser
                };
                AsyncStorage.setItem('userInfo', JSON.stringify(theUser));
            } else {
                throw (`Login type was ${type}`);
            }
            // Check if state fbToken is updated then navigate to landing page
            if (this.props.user.currentUser.fbToken != null) {
                this.props.navigation.navigate('Landing');
            } else {
                throw (`Token is null`);
            }
        } catch ({ message }) {
            console.log(`Facebook Login Error: ${message}`);
        }
    }

    // This is an attempt to disable backbutton to login screen after logging in
    // currently untested
    // TODO: look into better implementation 
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack(null);
        return true;
    };
    // end of attempt code.


    // For testing
    // 
    async componentDidMount() {
        let info = await this.getUserFromLocal();
        this.setUserInfo(info);
    }

    getUserFromLocal = async() => {
        let info = await AsyncStorage.getItem('userInfo');
        return info
    }

    setUserInfo = async (inf) => {
        try {
            // console.log(inf);
            if (inf != null) {
                let user = JSON.parse(inf);
                await this.props.loadUserInfoFromApi(user);
                await this.props.loadUserInfoFromLocal(user);
                // console.log('fbToken ', this.props.user.currentUser.fbToken);
                if (this.props.user.currentUser.fbToken != null && this.props.user.currentUser.user_id != null) {
                    this.props.navigation.navigate('Landing');
                } else {
                    // this.props.navigation.navigate('Login');
                    throw (`fbToken is null: ${this.props.user.currentUser.fbToken}`)
                }
            } else {
                // console.log('else ', inf);
                // this.props.navigation.navigate('Login');
                throw (`Login data is ${info}`);
            }
        } catch ({err}) {
        	console.log(`AsyncStorage load error: ${inf}`)
        }
    }

    render() {
        return (
            <ImageBackground style={styles.background} source={this.state.bg}>
                <View style={styles.loginScreenContainer}>
                    <Text style={styles.welcome}>Welcome to</Text>
                    <Image style={styles.appLogo} source={require('../assets/images/logo.png')} />
                    <View style={styles.swiper}>
                        <Swiper dotStyle={styles.dot} activeDotStyle={styles.activeDot}>
                            {/*uses Swiper library to swipe between the 3 views*/}
                            {/*NOTE: the bullets/dots shown on the screen is part of the addon and can be modified with the styles under Swiper*/}
                            <View style={styles.introContainer}>
                                <Image style={styles.introImage} source={require('../assets/Pngs/intro1.imageset/cards.png')} />
                                <Text style={styles.introText}>Post your event to start creating a guest list with people near you</Text>
                            </View>
                            <View style={styles.introContainer}>
                                <Image style={styles.introImage} source={require('../assets/Pngs/intro2.imageset/intro2.png')} />
                                <Text style={styles.introText}>"Lockin" or "Lockout" people wanting to attend your event</Text>
                            </View>
                            <View style={styles.introContainer}>
                                <Image style={styles.introImage} source={require('../assets/Pngs/intro3.imageset/Group.png')} />
                                <Text style={styles.introText}>Get invited to local events near you</Text>
                            </View>
                        </Swiper>
                    </View>
                    <Text style={styles.policy}>By continuing you agree to our{'\n'}
                        <Text onPress={() => this._openLink(this.props.tos_url)}>Terms of Service </Text>
                        and
                        <Text onPress={() => this._openLink(this.props.privacy_url)}> Privacy Policy</Text>
                    </Text>
                    <TouchableOpacity onPress={this.loginWithFb}>
                        <View style={styles.loginButton}>
                            <Image style={styles.fbLogo} source={require('../assets/images/fb-logo.png')} />
                            <Text style={styles.loginWFb}>Log in with Facebook</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginScreenContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: StatusBar.currentHeight
    },
    welcome: {
        fontFamily: 'Roboto',
        fontSize: height / 25,
        color: 'white'
    },
    appLogo: {
        alignItems: 'center',
        justifyContent: 'center',
        height: height * 0.13,
        resizeMode: 'contain',
    },
    swiper: {
        height: height * .5,
        width: width,
    },
    dot: {
        width: width / 45,
        height: width / 45,
        borderRadius: 5,
    },
    activeDot: {
        width: width / 45,
        height: width / 45,
        borderRadius: 5,
        backgroundColor: 'yellow'
    },
    introContainer: {
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    introImage: {
        resizeMode: 'contain',
        // width: 250,
        height: '85%',
        marginTop: 50,
    },
    introText: {
        fontFamily: 'Roboto',
        fontSize: height / 42,
        color: 'white',
        textAlign: 'center',
        width: '80%',
        height: '25%',
        flexWrap: 'wrap',
    },
    policy: {
        color: 'grey',
        textAlign: 'center',
        padding: 10,
        fontSize: height / 70
    },
    loginButton: {
        flexDirection: 'row',
        width: width * 0.8,
        height: height * 0.08,
        backgroundColor: '#3B5999',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fbLogo: {
        width: 28,
        height: 28,
    },
    loginWFb: {
        fontFamily: 'Roboto',
        fontSize: height / 30,
        color: 'white',
        marginLeft: 10,
    },
});


// Bindings for redux
const mapStateToProps = (state) => {
    const { user } = state;
    return { user }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        saveUserLogin,
        loadUserInfoFromLocal,
        loadUserInfoFromApi,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
// end of bindings