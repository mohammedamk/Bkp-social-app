import React, {Component} from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native';
import Slider from 'react-native-slider';
import WebBrowser from 'expo';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {saveSearchDistance, logoutUser} from "../actions/userActions";
import { fromLeft } from 'react-navigation-transitions';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;


class UserSettingScreen extends Component {
	static navigationOptions = {
		header: null,
		transitionConfig: () => fromLeft(),
	};
	constructor(props) {
		super(props);
		this.state = {
			profileImageSource: this.props.user.currentUser.fbPic,
			distance: this.props.user.currentUser.search_distance_km,
			name: this.props.user.currentUser.first,
			min: this.props.min,
			max: this.props.max,
			step: this.props.step,
		}
		this._openLink = this._openLink.bind(this);

		this.willFocus = this.props.navigation.addListener(
			'willFocus',
			() => {
				this.setState({profileImageSource: this.props.user.currentUser.fbPic});
			}
		);
	}

	

	 

	static defaultProps = {
		min: 1,
		max: 100,
		step: 1,
		tos_url: 'http://www.rendevousapp.com/terms-of-service/',
		privacy_url: 'http://www.rendevousapp.com/privacy-policy/',
		placeholder_pic: require('../assets/Pngs/placeholder-user-photo.imageset/placeholder-user-photo-1.png'),
	}

	testPress() {
		console.log('touchable pressed!\n');
	}

	// componentWillMount(){
	// 	alert(JSON.stringify(this.props.user.currentUser))
	// }

	componentWillUnmount() {

		this.willFocus.remove();
		this.props.saveSearchDistance(this.state.distance);
	}

	_openLink = async (link) => {
		await WebBrowser.WebBrowser.openBrowserAsync(link);
	}

    _logOut = () => {
        Alert.alert(
            '',
            'Log out of Rendevous?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
                {text: 'Log Out', onPress: () => {
					// clear fb token and state, then redirect to login screen
					this.props.logoutUser();
					if (this.props.user.currentUser.isLoggedIn == false) {
						this.props.navigation.navigate('Login');
					}
				}}
            ],
            {cancelable: false}
        )
    }

    _deleteAccount = () => {
        Alert.alert(
            'Warning',
            'Are you sure you want to delete your account? All content will be lost.',
            [
                {text: 'Yes', onPress: () => console.log('Yes Pressed')},
                {text: 'No', onPress: () => console.log('No Pressed')},
            ],
            {cancelable: false}
        )
    }

	render() {
		let profilePicSource;
		if (this.state.profileImageSource != null)
			profilePicSource = {uri: this.state.profileImageSource};
		else
			profilePicSource = this.props.placeholder_pic;

		return (
			<ImageBackground source={
				require('../assets/Pngs/bg.imageset/bg.png')
			} style={
				styles.backgroundImage
			}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={
						styles.topSettings
					}>
						<View style={
							styles.titleContainer
						}>
							<Text style={
								styles.titleText
							}>
								{'Settings'}
							</Text>
							<TouchableOpacity onPress={()=>this.props.navigation.navigate('Landing')}>
								<Image source={
									require('../assets/Icons/main_feed.imageset/main_feed.png')
								}/>
							</TouchableOpacity>
						</View>
						<TouchableOpacity onPress={()=>this.props.navigation.navigate('Profile', {
                                      message: false,
                                      profileInfo: this.props.user.currentUser
                                  })}>
						<Image source={
								profilePicSource
						} style={
							styles.profileImage
						}/>
						</TouchableOpacity>
						<View style={
							styles.topProfileTextContainer
						}>
							<Text style={
								styles.profileNameText
							}>
								{this.state.name}
							</Text>
							<TouchableOpacity onPress={()=>this.props.navigation.navigate('EditProfile')}>
								<Text style={
									styles.editProfileText
								}>
									{'Edit Profile'}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={
						styles.bottomSettings
					}>
						<View style={
							styles.searchDistanceContainer
						}>
							<View style={
								styles.searchDistanceTextContainer
							}>
								<Text style={{
									textAlign: 'left',
									margin: 8,
									flex: 1,
									fontSize: SCREEN_HEIGHT * 0.025,
								}}>
									{'Search distance'}
								</Text>
								<Text style={{
									textAlign: 'right',
									margin: 8,
									flex: 1,
									fontSize: SCREEN_HEIGHT * 0.025,
								}}>
									{this.state.distance} km
								</Text>
							</View>
							<Slider
								style={{
									width: SCREEN_WIDTH * 0.9,
									justifyContent: 'center',
								}}
								thumbTintColor= {'#FFFFFF'}
								thumbStyle= {{ elevation: 4, }}
								trackStyle= {{transform: [{ scaleY: 0.6 }]}}
								minimumTrackTintColor= {'#FDDA29'}
								value= {this.state.distance}
								minimumValue={this.state.min}
								maximumValue={this.state.max}
								step={this.state.step}
								onValueChange={(value) => this.setState({
									distance: value
								})}
							/>
						</View>
						<TouchableHighlight style={
							styles.textButtonWithArrowContainer
						} onPress={
							() => this.props.navigation.navigate('Invite')
						}>
							<View style={styles.highlightView}>
								<Text style={{
									textAlign: 'left',
									margin: 8,
									fontSize: SCREEN_HEIGHT * 0.025,
								}}>
									{'Invite Friends'}
								</Text>
								<Image source={
									require('../assets/Icons/rightArrow.imageset/rightArrow.png')
								} style={{
									position: 'absolute',
									right: SCREEN_WIDTH * 0.05,

								}}/>
							</View>
						</TouchableHighlight>
						<TouchableHighlight style={
							styles.textButtonWithArrowContainer
						} onPress={
							() => this._openLink(this.props.tos_url)
						}>
							<View style={styles.highlightView}>
								<Text style={{
									textAlign: 'left',
									margin: 8,
									fontSize: SCREEN_HEIGHT * 0.025,
								}}>
									{'Terms of Service'}
								</Text>
								<Image source={
									require('../assets/Icons/rightArrow.imageset/rightArrow.png')
								} style={{
									position: 'absolute',
									right: SCREEN_WIDTH * 0.05,
								}}/>
							</View>
						</TouchableHighlight>
						<TouchableHighlight style={
							styles.privacyContainer
						} onPress={
							() => this._openLink(this.props.privacy_url)
						}>
							<View style={styles.highlightView}>
								<Text style={{
									textAlign: 'left',
									margin: 8,
									fontSize: SCREEN_HEIGHT * 0.025,
								}}>
									{'Privacy Policy'}
								</Text>
								<Image source={
									require('../assets/Icons/rightArrow.imageset/rightArrow.png')
								} style={{
									position: 'absolute',
									right: SCREEN_WIDTH * 0.05,
								}}/>
							</View>
						</TouchableHighlight>
						<TouchableHighlight style={
							styles.textButtonContainer
						} onPress={
                            this._logOut
						}>
							<View style={styles.textButtonHighlight}>
								<Text style={{
									textAlign: 'center',
									margin: 8,
									fontSize: SCREEN_HEIGHT * 0.025,
								}}>
									{'Log Out'}
								</Text>
							</View>
						</TouchableHighlight>
						<TouchableHighlight style={
							styles.textButtonContainer
						} onPress={
                            this._deleteAccount
						}>
							<View style={styles.textButtonHighlight}>
								<Text style={{
									textAlign: 'center',
									margin: 8,
									fontSize: SCREEN_HEIGHT * 0.025,
								}}>
									{'Delete Account'}
								</Text>
							</View>
						</TouchableHighlight>
					</View>
				</ScrollView>
			</ImageBackground>
		)
	}
}

const styles = StyleSheet.create({
	emptySpace: {
		flex: 1,
	},
	topSettings: {
		alignItems: 'center',
		height: SCREEN_HEIGHT * 0.5,
		padding: SCREEN_HEIGHT * 0.034,
	},
	bottomSettings: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'stretch',
		backgroundColor: '#F2F3F4',
		height: SCREEN_HEIGHT * 0.75,
	},
	titleContainer: {
		top: 0,
		alignItems: 'center',
		flexDirection: 'row',
	},
	titleText: {
		justifyContent: 'center',
		alignItems: 'stretch',
		zIndex: 1,
		color: 'white',
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: SCREEN_HEIGHT * 0.028125,
		marginLeft: SCREEN_WIDTH * 0.35,
		marginRight: SCREEN_WIDTH * 0.31,
	},
	topProfileTextContainer: {
		position: 'absolute',
		bottom: SCREEN_HEIGHT * 0.034,
	},
	profileNameText: {
		justifyContent: 'center',
		alignItems: 'stretch',
		zIndex: 1,
		fontFamily: 'sans-serif-thin',
		color: 'white',
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: SCREEN_HEIGHT * 0.0375,
	},
	editProfileText: {
		justifyContent: 'center',
		alignItems: 'stretch',
		zIndex: 1,
		color: 'white',
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: SCREEN_HEIGHT * 0.021875,
	},
	profileImage: {
		justifyContent: 'center',
		alignItems: 'center',
		resizeMode: 'contain',
		borderTopRightRadius: SCREEN_HEIGHT * 0.15625,
		borderTopLeftRadius: SCREEN_HEIGHT * 0.15625,
		borderBottomLeftRadius: SCREEN_HEIGHT * 0.109375,
		borderBottomRightRadius: SCREEN_HEIGHT * 0.109375,
		marginTop: SCREEN_HEIGHT * 0.063,
		marginBottom: SCREEN_HEIGHT * 0.037,
		width: SCREEN_WIDTH * 0.4,
		height: SCREEN_HEIGHT * 0.23,
	},
	searchDistanceContainer: {
		flexDirection: 'column',
		backgroundColor: '#FFFFFF',
		elevation: 1,
		padding: SCREEN_WIDTH * 0.026,
		marginTop: SCREEN_HEIGHT * 0.04,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT * 0.14,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'visible',
	},
	searchDistanceTextContainer: {
		
		flexDirection: 'row'
	},
	textButtonWithArrowContainer: {
		backgroundColor: '#FFFFFF',
    	elevation: 1,
    	marginTop: SCREEN_HEIGHT * 0.04,
    	width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT * 0.07,
	},
	privacyContainer: {
		flex: 1.5,
		backgroundColor: '#FFFFFF',
		flexDirection: 'row',
    	alignItems: 'center',
    	elevation: 1,
    	marginBottom: SCREEN_HEIGHT * 0.04,
    	width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT * 0.07,
	},
	textButtonContainer: {
		flex: 1.5,
		backgroundColor: '#FFFFFF',
		flexDirection: 'row',
    	justifyContent: 'center',
    	alignItems: 'center',
    	elevation: 1,
    	marginBottom: SCREEN_HEIGHT * 0.04,
    	width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT * 0.07,
	},
	textButtonHighlight: {
		width: '100%',
		height: '100%',
		backgroundColor: '#FFFFFF',
		flexDirection: 'row',
    	alignItems: 'center',
    	justifyContent: 'center',
	},
	backgroundImage: {
		height: '100%',
		width: '100%',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'stretch',
	},
	highlightView: {
		width: '100%',
		height: '100%',
		backgroundColor: '#FFFFFF',
		paddingLeft: SCREEN_WIDTH * 0.026,
    	paddingRight: SCREEN_WIDTH * 0.026,
		flexDirection: 'row',
    	alignItems: 'center',
	},
});

const mapStateToProps = (state) => {
	const { user } = state;
	return { user }
};

const mapDispatchToProps = dispatch => (
	bindActionCreators({
		saveSearchDistance,
		logoutUser,
	}, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(UserSettingScreen);