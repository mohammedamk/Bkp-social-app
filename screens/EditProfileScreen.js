import React, {Component} from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableHighlight,
    View
} from 'react-native';

import update from 'immutability-helper';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {saveProfileDetails} from "../actions/userActions";
import AddPhotoComponent from "../components/AddPhotoComponent";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.091;
const IMAGE1_COORD = { x: SCREEN_WIDTH * 0.35, y: SCREEN_WIDTH * 0.35}
const IMAGE2_COORD = { x: SCREEN_WIDTH * 0.03, y: SCREEN_HEIGHT * 0.59}
const IMAGE3_COORD = { x: SCREEN_WIDTH * 0.35, y: SCREEN_HEIGHT * 0.59}
const IMAGE4_COORD = { x: SCREEN_WIDTH * 0.67, y: SCREEN_HEIGHT * 0.59}

class EditProfileScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imageSource: [
				this.props.user.currentUser.photo1_url,
				this.props.user.currentUser.photo2_url,
				this.props.user.currentUser.photo3_url,
				this.props.user.currentUser.photo4_url
			],
			imageExists: [
				false,
				false,
				false,
				false
			],

			profileBioText: this.props.user.currentUser.about,
			contactInfoText: this.props.user.currentUser.contact,

			image1Hovered: [false, false, false],
			image1OrigScale: 3.13,
			image1OrigX: IMAGE1_COORD.x,
			image1OrigY: IMAGE1_COORD.y,
			image1Scale: new Animated.Value(3.13),
			image1XY: new Animated.ValueXY({x: SCREEN_WIDTH * 0.35, y: SCREEN_WIDTH * 0.35}),
			image1ZIndex: 2,

			image2Hovered: [false, false, false],
			image2OrigScale: 1,
			image2OrigX: IMAGE2_COORD.x,
			image2OrigY: IMAGE2_COORD.y,
			image2Scale: new Animated.Value(1),
			image2XY: new Animated.ValueXY({x: SCREEN_WIDTH * 0.03, y: SCREEN_HEIGHT * 0.555}),
			image2ZIndex: 1,

			image3Hovered: [false, false, false],
			image3OrigScale: 1,
			image3OrigX: IMAGE3_COORD.x,
			image3OrigY: IMAGE3_COORD.y,
			image3Scale: new Animated.Value(1),
			image3XY: new Animated.ValueXY({x: SCREEN_WIDTH * 0.35, y: SCREEN_HEIGHT * 0.555}),
			image3ZIndex: 1,

			image4Hovered: [false, false, false],
			image4OrigScale: 1,
			image4OrigX: IMAGE4_COORD.x,
			image4OrigY: IMAGE4_COORD.y,
			image4Scale: new Animated.Value(1),
			image4XY: new Animated.ValueXY({x: SCREEN_WIDTH * 0.67, y: SCREEN_HEIGHT * 0.555}),
			image4ZIndex: 1,

			changesMade: false,
			isModalVisible: false,
		}

        this.addPhoto = this.addPhoto.bind(this);
        this._animateMove = this._animateMove.bind(this);
        this._animateResize = this._animateResize.bind(this);
        this._connectInsta = this._connectInsta.bind(this);
        this._createResponders = this._createResponders.bind(this);
        this._isInimage = this._isInImage.bind(this);
        this._saveProfile = this._saveProfile.bind(this);
        this._exit = this._exit.bind(this);

		this._initialCheckImagesExists();
        this._createResponders();
	}

	static navigationOptions = {
		header: null,
	};

	static defaultProps = {
		addImageSource: require('../assets/Icons/add_photo.imageset/add_photo.png'),
		mainImageOffset: 0.1502,
	}

	_createResponders () {

		this.image1PanResponder = PanResponder.create({
	        onStartShouldSetPanResponder : () => true,
	        onPanResponderGrant : (e, gesture) => {
	        	if (this.state.imageExists[0]) {
		        	this.setState({image1ZIndex: 2, image2ZIndex: 1, image3ZIndex: 1, image4ZIndex: 1});
		        	this._animateResize(this.state.image1Scale, this.state.image1OrigScale + 0.1);
		        	this.profileScroll.scrollTo({y: 0, animated: true});
		        }
	        },
	        onPanResponderMove : (e, gesture) => {
	        	if (this.state.imageExists[0]) {
		        	var curX = gesture.dx + this.state.image1OrigX;
		        	var curY = gesture.dy + this.state.image1OrigY;

		        	if (this._isInImage(gesture.moveX, gesture.moveY, this.state.image2OrigX - (this.state.image2OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image2OrigY - (this.state.image2OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image2OrigScale * 0.3) && 
		        	this.state.image2Hovered[0] === false && this.state.imageExists[1]) {
		        		this.setState({image2Hovered: update(this.state.image2Hovered, {0: {$set: true}})});
		        		this._animateMove(this.state.image2XY, this.state.image1OrigX, this.state.image1OrigY);
		        		this._animateResize(this.state.image1Scale, this.state.image2OrigScale);
		        		this._animateResize(this.state.image2Scale, this.state.image1OrigScale);
		        	}
		        	else if (!(this._isInImage(gesture.moveX, gesture.moveY, this.state.image2OrigX - (this.state.image2OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image2OrigY - (this.state.image2OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image2OrigScale * 0.3)) && 
		        	this.state.image2Hovered[0] === true && this.state.imageExists[1]) {
		        		this.setState({image2Hovered: update(this.state.image2Hovered, {0: {$set: false}})});
		        		this._animateMove(this.state.image2XY, this.state.image2OrigX, this.state.image2OrigY);
		        		this._animateResize(this.state.image1Scale, this.state.image1OrigScale);
		        		this._animateResize(this.state.image2Scale, this.state.image2OrigScale);
		        	}

		        	if (this._isInImage(gesture.moveX, gesture.moveY, this.state.image3OrigX - (this.state.image3OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image3OrigY - (this.state.image3OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image3OrigScale * 0.3) && 
		        	this.state.image3Hovered[0] === false && this.state.imageExists[2]) {
		        		this.setState({image3Hovered: update(this.state.image3Hovered, {0: {$set: true}})});
		        		this._animateMove(this.state.image3XY, this.state.image1OrigX, this.state.image1OrigY);
		        		this._animateResize(this.state.image1Scale, this.state.image3OrigScale);
		        		this._animateResize(this.state.image3Scale, this.state.image1OrigScale);
		        	}
		        	else if (!(this._isInImage(gesture.moveX, gesture.moveY, this.state.image3OrigX - (this.state.image3OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image3OrigY - (this.state.image3OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image3OrigScale * 0.3)) && 
		        	this.state.image3Hovered[0] === true && this.state.imageExists[2]) {
		        		this.setState({image3Hovered: update(this.state.image3Hovered, {0: {$set: false}})});
		        		this._animateMove(this.state.image3XY, this.state.image3OrigX, this.state.image3OrigY);
		        		this._animateResize(this.state.image1Scale, this.state.image1OrigScale);
		        		this._animateResize(this.state.image3Scale, this.state.image3OrigScale);
		        	}

		        	if (this._isInImage(gesture.moveX, gesture.moveY, this.state.image4OrigX - (this.state.image4OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image4OrigY - (this.state.image4OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image4OrigScale * 0.3) && 
		        	this.state.image4Hovered[0] === false && this.state.imageExists[3]) {
		        		this.setState({image4Hovered: update(this.state.image4Hovered, {0: {$set: true}})});
		        		this._animateMove(this.state.image4XY, this.state.image1OrigX, this.state.image1OrigY);
		        		this._animateResize(this.state.image1Scale, this.state.image4OrigScale);
		        		this._animateResize(this.state.image4Scale, this.state.image1OrigScale);
		        	}
		        	else if (!(this._isInImage(gesture.moveX, gesture.moveY, this.state.image4OrigX - (this.state.image4OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image4OrigY - (this.state.image4OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image4OrigScale * 0.3)) && 
		        	this.state.image4Hovered[0] === true && this.state.imageExists[3]) {
		        		this.setState({image4Hovered: update(this.state.image4Hovered, {0: {$set: false}})});
		        		this._animateMove(this.state.image4XY, this.state.image4OrigX, this.state.image4OrigY);
		        		this._animateResize(this.state.image1Scale, this.state.image1OrigScale);
		        		this._animateResize(this.state.image4Scale, this.state.image4OrigScale);
		        	}
		        	
		        	this._animateMove(this.state.image1XY, curX, curY);
		        }
	        },
	        onPanResponderRelease : (e, gesture) => {
	        	if (this.state.imageExists[0]) {
		        	if (this.state.image2Hovered[0]) {
		        		this._animateMove(this.state.image1XY, this.state.image2OrigX, this.state.image2OrigY);
				        this.setState((prevState) => ({
				        	image1OrigScale: prevState.image2OrigScale,
				        	image1OrigX: prevState.image2OrigX,
				        	image1OrigY: prevState.image2OrigY,
				        	image2OrigScale: prevState.image1OrigScale,
				        	image2OrigX: prevState.image1OrigX,
				        	image2OrigY: prevState.image1OrigY,
				        	changesMade: true,
				        }));
		        	}
		        	else if (this.state.image3Hovered[0]) {
		        		this._animateMove(this.state.image1XY, this.state.image3OrigX, this.state.image3OrigY);
				        this.setState((prevState) => ({
				        	image1OrigScale: prevState.image3OrigScale,
				        	image1OrigX: prevState.image3OrigX,
				        	image1OrigY: prevState.image3OrigY,
				        	image3OrigScale: prevState.image1OrigScale,
				        	image3OrigX: prevState.image1OrigX,
				        	image3OrigY: prevState.image1OrigY,
				        	changesMade: true,
				        }));
		        	}
		        	else if (this.state.image4Hovered[0]) {
		        		this._animateMove(this.state.image1XY, this.state.image4OrigX, this.state.image4OrigY);
				        this.setState((prevState) => ({
				        	image1OrigScale: prevState.image4OrigScale,
				        	image1OrigX: prevState.image4OrigX,
				        	image1OrigY: prevState.image4OrigY,
				        	image4OrigScale: prevState.image1OrigScale,
				        	image4OrigX: prevState.image1OrigX,
				        	image4OrigY: prevState.image1OrigY,
				        	changesMade: true,
				        }));
		        	}
		        	else {
		        		this._animateMove(this.state.image1XY, this.state.image1OrigX, this.state.image1OrigY);
		        		this._animateResize(this.state.image1Scale, this.state.image1OrigScale);
		        	}
		        }
	        },
	        onPanResponderTerminate: (e, gesture) => {
	        	if (this.state.imageExists[0]) {
		        	this._animateMove(this.state.image1XY, this.state.image1OrigX, this.state.image1OrigY);
		        	this._animateResize(this.state.image1Scale, this.state.image1OrigScale);
		        }
	        },
	    });

		this.image2PanResponder = PanResponder.create({
			onStartShouldSetPanResponder : () => true,
	        onPanResponderGrant : (e, gesture) => {
	        	if (this.state.imageExists[1]) {
		        	this.setState({image1ZIndex: 1, image2ZIndex: 2, image3ZIndex: 1, image4ZIndex: 1});
		        	this._animateResize(this.state.image2Scale, this.state.image2OrigScale + 0.1);
		        	this.profileScroll.scrollTo({y: 0, animated: true});
		        }
	        },
	        onPanResponderMove : (e, gesture) => {
	        	if (this.state.imageExists[1]) {
		        	var curX = gesture.dx + this.state.image2OrigX;
		        	var curY = gesture.dy + this.state.image2OrigY;

		        	if (this._isInImage(gesture.moveX, gesture.moveY, this.state.image1OrigX - (this.state.image1OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image1OrigY - (this.state.image1OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image1OrigScale * 0.3) && 
		        	this.state.image1Hovered[0] === false && this.state.imageExists[0]) {
		        		this.setState({image1Hovered: update(this.state.image1Hovered, {0: {$set: true}})});
		        		this._animateMove(this.state.image1XY, this.state.image2OrigX, this.state.image2OrigY);
		        		this._animateResize(this.state.image1Scale, this.state.image2OrigScale);
		        		this._animateResize(this.state.image2Scale, this.state.image1OrigScale);
		        	}
		        	else if (!(this._isInImage(gesture.moveX, gesture.moveY, this.state.image1OrigX - (this.state.image1OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image1OrigY - (this.state.image1OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image1OrigScale * 0.3)) && 
		        	this.state.image1Hovered[0] === true && this.state.imageExists[0]) {
		        		this.setState({image1Hovered: update(this.state.image1Hovered, {0: {$set: false}})});
		        		this._animateMove(this.state.image1XY, this.state.image1OrigX, this.state.image1OrigY);
		        		this._animateResize(this.state.image1Scale, this.state.image1OrigScale);
		        		this._animateResize(this.state.image2Scale, this.state.image2OrigScale);
		        	}

		        	if (this._isInImage(gesture.moveX, gesture.moveY, this.state.image3OrigX - (this.state.image3OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image3OrigY - (this.state.image3OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image3OrigScale * 0.3) && 
		        	this.state.image3Hovered[1] === false && this.state.imageExists[2]) {
		        		this.setState({image3Hovered: update(this.state.image3Hovered, {1: {$set: true}})});
		        		this._animateMove(this.state.image3XY, this.state.image2OrigX, this.state.image2OrigY);
		        		this._animateResize(this.state.image3Scale, this.state.image2OrigScale);
		        		this._animateResize(this.state.image2Scale, this.state.image3OrigScale);
		        	}
		        	else if (!(this._isInImage(gesture.moveX, gesture.moveY, this.state.image3OrigX - (this.state.image3OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image3OrigY - (this.state.image3OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image3OrigScale * 0.3)) && 
		        	this.state.image3Hovered[1] === true && this.state.imageExists[2]) {
		        		this.setState({image3Hovered: update(this.state.image3Hovered, {1: {$set: false}})});
		        		this._animateMove(this.state.image3XY, this.state.image3OrigX, this.state.image3OrigY);
		        		this._animateResize(this.state.image3Scale, this.state.image3OrigScale);
		        		this._animateResize(this.state.image2Scale, this.state.image2OrigScale);
		        	}

		        	if (this._isInImage(gesture.moveX, gesture.moveY, this.state.image4OrigX - (this.state.image4OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image4OrigY - (this.state.image4OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image4OrigScale * 0.3) && 
		        	this.state.image4Hovered[1] === false && this.state.imageExists[3]) {
		        		this.setState({image4Hovered: update(this.state.image4Hovered, {1: {$set: true}})});
		        		this._animateMove(this.state.image4XY, this.state.image2OrigX, this.state.image2OrigY);
		        		this._animateResize(this.state.image4Scale, this.state.image2OrigScale);
		        		this._animateResize(this.state.image2Scale, this.state.image4OrigScale);
		        	}
		        	else if (!(this._isInImage(gesture.moveX, gesture.moveY, this.state.image4OrigX - (this.state.image4OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image4OrigY - (this.state.image4OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image4OrigScale * 0.3)) && 
		        	this.state.image4Hovered[1] === true && this.state.imageExists[3]) {
		        		this.setState({image4Hovered: update(this.state.image4Hovered, {1: {$set: false}})});
		        		this._animateMove(this.state.image4XY, this.state.image4OrigX, this.state.image4OrigY);
		        		this._animateResize(this.state.image4Scale, this.state.image4OrigScale);
		        		this._animateResize(this.state.image2Scale, this.state.image2OrigScale);
		        	}
		        	
		        	this._animateMove(this.state.image2XY, curX, curY);
		        }
	        },
	        onPanResponderRelease : (e, gesture) => {
	        	if (this.state.imageExists[1]) {
		        	if (this.state.image1Hovered[0]) {
		        		this._animateMove(this.state.image2XY, this.state.image1OrigX, this.state.image1OrigY);
				        this.setState((prevState) => ({
				        	image1OrigScale: prevState.image2OrigScale,
				        	image1OrigX: prevState.image2OrigX,
				        	image1OrigY: prevState.image2OrigY,
				        	image2OrigScale: prevState.image1OrigScale,
				        	image2OrigX: prevState.image1OrigX,
				        	image2OrigY: prevState.image1OrigY,
				        	changesMade: true,
				        }));
		        	}
		        	else if (this.state.image3Hovered[1]) {
		        		this._animateMove(this.state.image2XY, this.state.image3OrigX, this.state.image3OrigY);
				        this.setState((prevState) => ({
				        	image2OrigScale: prevState.image3OrigScale,
				        	image2OrigX: prevState.image3OrigX,
				        	image2OrigY: prevState.image3OrigY,
				        	image3OrigScale: prevState.image2OrigScale,
				        	image3OrigX: prevState.image2OrigX,
				        	image3OrigY: prevState.image2OrigY,
				        	changesMade: true,
				        }));
		        	}
		        	else if (this.state.image4Hovered[1]) {
		        		this._animateMove(this.state.image2XY, this.state.image4OrigX, this.state.image4OrigY);
				        this.setState((prevState) => ({
				        	image2OrigScale: prevState.image4OrigScale,
				        	image2OrigX: prevState.image4OrigX,
				        	image2OrigY: prevState.image4OrigY,
				        	image4OrigScale: prevState.image2OrigScale,
				        	image4OrigX: prevState.image2OrigX,
				        	image4OrigY: prevState.image2OrigY,
				        	changesMade: true,
				        }));
		        	}
		        	else {
		        		this._animateMove(this.state.image2XY, this.state.image2OrigX, this.state.image2OrigY);
			        	this._animateResize(this.state.image2Scale, this.state.image2OrigScale);
		        	}
		        }
	        },
	        onPanResponderTerminate: (e, gesture) => {
	        	if (this.state.imageExists[1]) {
		        	this._animateMove(this.state.image2XY, this.state.image2OrigX, this.state.image2OrigY);
		        	this._animateResize(this.state.image2Scale, this.state.image2OrigScale);
		        }
	        },
		});

		this.image3PanResponder = PanResponder.create({
			onStartShouldSetPanResponder : () => true,
	        onPanResponderGrant : (e, gesture) => {
	        	if (this.state.imageExists[2]) {
		        	this.setState({image1ZIndex: 1, image2ZIndex: 1, image3ZIndex: 2, image4ZIndex: 1});
		        	this._animateResize(this.state.image3Scale, this.state.image3OrigScale + 0.1);
		        	this.profileScroll.scrollTo({y: 0, animated: true});
		        }
	        },
	        onPanResponderMove : (e, gesture) => {
	        	if (this.state.imageExists[2]) {
		        	var curX = gesture.dx + this.state.image3OrigX;
		        	var curY = gesture.dy + this.state.image3OrigY;

		        	if (this._isInImage(gesture.moveX, gesture.moveY, this.state.image1OrigX - (this.state.image1OrigScale - 1) *
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image1OrigY - (this.state.image1OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image1OrigScale * 0.3) && 
		        	this.state.image1Hovered[1] === false && this.state.imageExists[0]) {
		        		this.setState({image1Hovered: update(this.state.image1Hovered, {1: {$set: true}})});
		        		this._animateMove(this.state.image1XY, this.state.image3OrigX, this.state.image3OrigY);
		        		this._animateResize(this.state.image1Scale, this.state.image3OrigScale);
		        		this._animateResize(this.state.image3Scale, this.state.image1OrigScale);
		        	}
		        	else if (!(this._isInImage(gesture.moveX, gesture.moveY, this.state.image1OrigX - (this.state.image1OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image1OrigY - (this.state.image1OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image1OrigScale * 0.3)) && 
		        	this.state.image1Hovered[1] === true && this.state.imageExists[0]) {
		        		this.setState({image1Hovered: update(this.state.image1Hovered, {1: {$set: false}})});
		        		this._animateMove(this.state.image1XY, this.state.image1OrigX, this.state.image1OrigY);
		        		this._animateResize(this.state.image1Scale, this.state.image1OrigScale);
		        		this._animateResize(this.state.image3Scale, this.state.image3OrigScale);
		        	}

		        	if (this._isInImage(gesture.moveX, gesture.moveY, this.state.image2OrigX - (this.state.image2OrigScale - 1) *
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image2OrigY - (this.state.image2OrigScale - 1) *
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image2OrigScale * 0.3) && 
		        	this.state.image2Hovered[1] === false && this.state.imageExists[1]) {
		        		this.setState({image2Hovered: update(this.state.image2Hovered, {1: {$set: true}})});
		        		this._animateMove(this.state.image2XY, this.state.image3OrigX, this.state.image3OrigY);
		        		this._animateResize(this.state.image3Scale, this.state.image2OrigScale);
		        		this._animateResize(this.state.image2Scale, this.state.image3OrigScale);
		        	}
		        	else if (!(this._isInImage(gesture.moveX, gesture.moveY, this.state.image2OrigX - (this.state.image2OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image2OrigY - (this.state.image2OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image2OrigScale * 0.3)) && 
		        	this.state.image2Hovered[1] === true && this.state.imageExists[1]) {
		        		this.setState({image2Hovered: update(this.state.image2Hovered, {1: {$set: false}})});
		        		this._animateMove(this.state.image2XY, this.state.image2OrigX, this.state.image2OrigY);
		        		this._animateResize(this.state.image3Scale, this.state.image3OrigScale);
		        		this._animateResize(this.state.image2Scale, this.state.image2OrigScale);
		        	}

		        	if (this._isInImage(gesture.moveX, gesture.moveY, this.state.image4OrigX - (this.state.image4OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image4OrigY - (this.state.image4OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image4OrigScale * 0.3) && 
		        	this.state.image4Hovered[2] === false && this.state.imageExists[3]) {
		        		this.setState({image4Hovered: update(this.state.image4Hovered, {2: {$set: true}})});
		        		this._animateMove(this.state.image4XY, this.state.image3OrigX, this.state.image3OrigY);
		        		this._animateResize(this.state.image4Scale, this.state.image3OrigScale);
		        		this._animateResize(this.state.image3Scale, this.state.image4OrigScale);
		        	}
		        	else if (!(this._isInImage(gesture.moveX, gesture.moveY, this.state.image4OrigX - (this.state.image4OrigScale - 1) *
		        		this.props.mainImageOffset * SCREEN_WIDTH, this.state.image4OrigY - (this.state.image4OrigScale - 1) *
		        		this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image4OrigScale * 0.3)) &&
		        		this.state.image4Hovered[2] === true && this.state.imageExists[3]) {
		        		this.setState({image4Hovered: update(this.state.image4Hovered, {2: {$set: false}})});
		        		this._animateMove(this.state.image4XY, this.state.image4OrigX, this.state.image4OrigY);
		        		this._animateResize(this.state.image4Scale, this.state.image4OrigScale);
		        		this._animateResize(this.state.image3Scale, this.state.image3OrigScale);
		        	}
		        	
		        	this._animateMove(this.state.image3XY, curX, curY);
		        }
	        },
	        onPanResponderRelease : (e, gesture) => {
	        	if (this.state.imageExists[2]) {
		        	if (this.state.image1Hovered[1]) {
		        		this._animateMove(this.state.image3XY, this.state.image1OrigX, this.state.image1OrigY);
				        this.setState((prevState) => ({
				        	image1OrigScale: prevState.image3OrigScale,
				        	image1OrigX: prevState.image3OrigX,
				        	image1OrigY: prevState.image3OrigY,
				        	image3OrigScale: prevState.image1OrigScale,
				        	image3OrigX: prevState.image1OrigX,
				        	image3OrigY: prevState.image1OrigY,
				        	changesMade: true,
				        }));
		        	}
		        	else if (this.state.image2Hovered[1]) {
		        		this._animateMove(this.state.image3XY, this.state.image2OrigX, this.state.image2OrigY);
				        this.setState((prevState) => ({
				        	image2OrigScale: prevState.image3OrigScale,
				        	image2OrigX: prevState.image3OrigX,
				        	image2OrigY: prevState.image3OrigY,
				        	image3OrigScale: prevState.image2OrigScale,
				        	image3OrigX: prevState.image2OrigX,
				        	image3OrigY: prevState.image2OrigY,
				        	changesMade: true,
				        }));
		        	}
		        	else if (this.state.image4Hovered[2]) {
		        		this._animateMove(this.state.image3XY, this.state.image4OrigX, this.state.image4OrigY);
				        this.setState((prevState) => ({
				        	image3OrigScale: prevState.image4OrigScale,
				        	image3OrigX: prevState.image4OrigX,
				        	image3OrigY: prevState.image4OrigY,
				        	image4OrigScale: prevState.image3OrigScale,
				        	image4OrigX: prevState.image3OrigX,
				        	image4OrigY: prevState.image3OrigY,
				        	changesMade: true,
				        }));
		        	}
		        	else {
		        		this._animateMove(this.state.image3XY, this.state.image3OrigX, this.state.image3OrigY);
			        	this._animateResize(this.state.image3Scale, this.state.image3OrigScale);
		        	}
		        }
	        },
	        onPanResponderTerminate: (e, gesture) => {
	        	if (this.state.imageExists[2]) {
		        	this._animateMove(this.state.image3XY, this.state.image3OrigX, this.state.image3OrigY);
		        	this._animateResize(this.state.image3Scale, this.state.image3OrigScale);
		        }
	        },
		});

		this.image4PanResponder = PanResponder.create({
			onStartShouldSetPanResponder : () => true,
	        onPanResponderGrant : (e, gesture) => {
	        	if (this.state.imageExists[3]) {
		        	this.setState({image1ZIndex: 1, image2ZIndex: 1, image3ZIndex: 1, image4ZIndex: 2});
		        	this._animateResize(this.state.image4Scale, this.state.image4OrigScale + 0.1);
		        	this.profileScroll.scrollTo({y: 0, animated: true});
		        }
	        },
	        onPanResponderMove : (e, gesture) => {
	        	if (this.state.imageExists[3]) {
		        	var curX = gesture.dx + this.state.image4OrigX;
		        	var curY = gesture.dy + this.state.image4OrigY;

		        	if (this._isInImage(gesture.moveX, gesture.moveY, this.state.image1OrigX - (this.state.image1OrigScale - 1) *
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image1OrigY - (this.state.image1OrigScale - 1) *
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image1OrigScale * 0.3) &&
		        	this.state.image1Hovered[2] === false && this.state.imageExists[0]) {
		        		this.setState({image1Hovered: update(this.state.image1Hovered, {2: {$set: true}})});
		        		this._animateMove(this.state.image1XY, this.state.image4OrigX, this.state.image4OrigY);
		        		this._animateResize(this.state.image1Scale, this.state.image4OrigScale);
		        		this._animateResize(this.state.image4Scale, this.state.image1OrigScale);
		        	}
		        	else if (!(this._isInImage(gesture.moveX, gesture.moveY, this.state.image1OrigX - (this.state.image1OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image1OrigY - (this.state.image1OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image1OrigScale * 0.3)) && 
		        	this.state.image1Hovered[2] === true && this.state.imageExists[0]) {
		        		this.setState({image1Hovered: update(this.state.image1Hovered, {2: {$set: false}})});
		        		this._animateMove(this.state.image1XY, this.state.image1OrigX, this.state.image1OrigY);
		        		this._animateResize(this.state.image1Scale, this.state.image1OrigScale);
		        		this._animateResize(this.state.image4Scale, this.state.image4OrigScale);
		        	}

		        	if (this._isInImage(gesture.moveX, gesture.moveY, this.state.image2OrigX - (this.state.image2OrigScale - 1) *
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image2OrigY - (this.state.image2OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image2OrigScale * 0.3) && 
		        	this.state.image2Hovered[2] === false && this.state.imageExists[1]) {
		        		this.setState({image2Hovered: update(this.state.image2Hovered, {2: {$set: true}})});
		        		this._animateMove(this.state.image2XY, this.state.image4OrigX, this.state.image4OrigY);
		        		this._animateResize(this.state.image4Scale, this.state.image2OrigScale);
		        		this._animateResize(this.state.image2Scale, this.state.image4OrigScale);
		        	}
		        	else if (!(this._isInImage(gesture.moveX, gesture.moveY, this.state.image2OrigX - (this.state.image2OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image2OrigY - (this.state.image2OrigScale - 1) *
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image2OrigScale * 0.3)) &&
		        		this.state.image2Hovered[2] === true && this.state.imageExists[1]) {
		        		this.setState({image2Hovered: update(this.state.image2Hovered, {2: {$set: false}})});
		        		this._animateMove(this.state.image2XY, this.state.image2OrigX, this.state.image2OrigY);
		        		this._animateResize(this.state.image4Scale, this.state.image4OrigScale);
		        		this._animateResize(this.state.image2Scale, this.state.image2OrigScale);
		        	}

		        	if (this._isInImage(gesture.moveX, gesture.moveY, this.state.image3OrigX - (this.state.image3OrigScale - 1) *
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image3OrigY - (this.state.image3OrigScale - 1) *
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image3OrigScale * 0.3) &&
		        	this.state.image3Hovered[2] === false && this.state.imageExists[2]) {
		        		this.setState({image3Hovered: update(this.state.image3Hovered, {2: {$set: true}})});
		        		this._animateMove(this.state.image3XY, this.state.image4OrigX, this.state.image4OrigY);
		        		this._animateResize(this.state.image4Scale, this.state.image3OrigScale);
		        		this._animateResize(this.state.image3Scale, this.state.image4OrigScale);
		        	}
		        	else if (!(this._isInImage(gesture.moveX, gesture.moveY, this.state.image3OrigX - (this.state.image3OrigScale - 1) *
		        	this.props.mainImageOffset * SCREEN_WIDTH, this.state.image3OrigY - (this.state.image3OrigScale - 1) * 
		        	this.props.mainImageOffset * SCREEN_WIDTH + HEADER_HEIGHT, SCREEN_WIDTH * this.state.image3OrigScale * 0.3)) && 
		        	this.state.image3Hovered[2] === true && this.state.imageExists[2]) {
		        		this.setState({image3Hovered: update(this.state.image3Hovered, {2: {$set: false}})});
		        		this._animateMove(this.state.image3XY, this.state.image3OrigX, this.state.image3OrigY);
		        		this._animateResize(this.state.image4Scale, this.state.image4OrigScale);
		        		this._animateResize(this.state.image3Scale, this.state.image3OrigScale);
		        	}
		        	
		        	this._animateMove(this.state.image4XY, curX, curY);
		        }
	        },
	        onPanResponderRelease : (e, gesture) => {
	        	if (this.state.imageExists[3]) {
		        	if (this.state.image1Hovered[2]) {
		        		this._animateMove(this.state.image4XY, this.state.image1OrigX, this.state.image1OrigY);
				        this.setState((prevState) => ({
				        	image1OrigScale: prevState.image4OrigScale,
				        	image1OrigX: prevState.image4OrigX,
				        	image1OrigY: prevState.image4OrigY,
				        	image4OrigScale: prevState.image1OrigScale,
				        	image4OrigX: prevState.image1OrigX,
				        	image4OrigY: prevState.image1OrigY,
				        	changesMade: true,
				        }));
		        	}
		        	else if (this.state.image2Hovered[2]) {
		        		this._animateMove(this.state.image4XY, this.state.image2OrigX, this.state.image2OrigY);
				        this.setState((prevState) => ({
				        	image2OrigScale: prevState.image4OrigScale,
				        	image2OrigX: prevState.image4OrigX,
				        	image2OrigY: prevState.image4OrigY,
				        	image4OrigScale: prevState.image2OrigScale,
				        	image4OrigX: prevState.image2OrigX,
				        	image4OrigY: prevState.image2OrigY,
				        	changesMade: true,
				        }));
		        	}
		        	else if (this.state.image3Hovered[2]) {
		        		this._animateMove(this.state.image4XY, this.state.image3OrigX, this.state.image3OrigY);
				        this.setState((prevState) => ({
				        	image3OrigScale: prevState.image4OrigScale,
				        	image3OrigX: prevState.image4OrigX,
				        	image3OrigY: prevState.image4OrigY,
				        	image4OrigScale: prevState.image3OrigScale,
				        	image4OrigX: prevState.image3OrigX,
				        	image4OrigY: prevState.image3OrigY,
				        	changesMade: true,
				        }));
		        	}
		        	else {
		        		this._animateMove(this.state.image4XY, this.state.image4OrigX, this.state.image4OrigY);
			        	this._animateResize(this.state.image4Scale, this.state.image4OrigScale);
		        	}
		        }
	        },
	        onPanResponderTerminate: (e, gesture) => {
	        	if (this.state.imageExists[3]) {
		        	this._animateMove(this.state.image4XY, this.state.image4OrigX, this.state.image4OrigY);
		        	this._animateResize(this.state.image4Scale, this.state.image4OrigScale);
		        }
	        },
		});
	}

	_isInImage (curX, curY, xPos, yPos, size) {
		if (xPos < curX && curX < (xPos + size) && yPos < curY && curY < (yPos + size)) {
			return true;
		}
		else {
			return false;
		}
	}

	_animateMove (imageXY, xPos, yPos) {
		Animated.spring(
            imageXY,
            {
            	toValue : {
	            	x : xPos,
	            	y : yPos,
            	},
            	speed: 20,
            },
        ).start();
	}

	_animateResize (imageScale, newSize) {
		Animated.spring(
            imageScale,
            {
            	toValue : newSize,
            	speed: 20,
            },
        ).start();
	}

	_exit = () => {
		if (this.state.changesMade) {
			Alert.alert(
	            '',
	            'You have unsaved changes to your profile. Would you like to save?',
	            [
	                {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
	                {text: 'No', onPress: () => this.props.navigation.navigate('ProfileSetting')},
	                {text: 'Yes', onPress: () => this._saveProfile()},
	            ],
	            {cancelable: false}
	        )
		}
		else {
			this.props.navigation.navigate('ProfileSetting');
		}
	}

	_saveProfile = () => {
		let oldCoord = [
			{ x: this.state.image1OrigX, y: this.state.image1OrigY },
			{ x: this.state.image2OrigX, y: this.state.image2OrigY },
			{ x: this.state.image3OrigX, y: this.state.image3OrigY },
			{ x: this.state.image4OrigX, y: this.state.image4OrigY },
		];
		let newSourceIndex = [];

		for (let i = 0; i < 4; i++) {
			newSourceIndex.push(this._getImageOrder(oldCoord[i].x, oldCoord[i].y))
		}

		let newImageSource = [...this.state.imageSource];

		for(let j = 0; j < 4; j++) {
			newImageSource[j] = this.state.imageSource[newSourceIndex.indexOf(j)]
		}

		this.setState({
			imageSource: newImageSource
		}, () => this.props.saveProfileDetails(this.state));

		this.props.navigation.navigate('ProfileSetting');
	}

	_getImageOrder = (x, y) => {
		if (x == IMAGE1_COORD.x && y == IMAGE1_COORD.y)
			return 0;
		if (x == IMAGE2_COORD.x && y == IMAGE2_COORD.y)
			return 1;
		if (x == IMAGE3_COORD.x && y == IMAGE3_COORD.y)
			return 2;
		if (x == IMAGE4_COORD.x && y == IMAGE4_COORD.y)
			return 3;
	}

	_initialCheckImagesExists() {
		let newImageExists = this.state.imageExists;
		for (let i = 0; i < this.state.imageExists.length; i++) {
			if (this.state.imageSource[i] != null)
				newImageExists[i] = true;
		}
		this.state.imageExists = newImageExists;
	}

	_checkImagesExists() {
		let newImageExists = this.state.imageExists;
		for (let i = 0; i < this.state.imageExists.length; i++) {
			if (this.state.imageSource[i] != null)
				newImageExists[i] = true;
			else
				newImageExists[i] = false;
		}
		this.setState({ imageExists: newImageExists });
	}

    _connectInsta = () => {
        console.log('ConnectInsta Pressed');
    }

    addPhoto = () => {
    	this.setState({
            isModalVisible: !this.state.isModalVisible,
            imageSource: [
				this.props.user.currentUser.photo1_url,
				this.props.user.currentUser.photo2_url,
				this.props.user.currentUser.photo3_url,
				this.props.user.currentUser.photo4_url
			],
        });
        this._checkImagesExists();
    }

    _deletePhoto(photoIndex) {
    	let newSource = this.state.imageSource;
    	for (let i = photoIndex; i < this.state.imageSource.length; i++) {
    		if (i != (this.state.imageSource.length - 1)) {
    			newSource[i] = newSource[i+1];
    		}
    		else
    			newSource[i] = null;
    	}
    	this.setState({
			imageSource: newSource
		}, () => this.props.saveProfileDetails(this.state));
		this._checkImagesExists();
    }

    _deletePhotoAlert(photoIndex) {
    	Alert.alert(
            '',
            'Are you sure you would like to delete this photo?',
            [
                {text: 'No', onPress: () => {}},
                {text: 'Yes', onPress: () => this._deletePhoto(photoIndex)},
            ],
            {cancelable: false}
        )
    }

	render() {
		const image1 = 	<Animated.View {...this.image1PanResponder.panHandlers} style={[styles.mainImageView, this.state.image1XY.getLayout(), {zIndex: this.state.image1ZIndex, transform: [{scale: this.state.image1Scale}]}]}>
							<Animated.Image source={{uri: this.state.imageSource[0]}} style={[styles.mainImage]} />
							<TouchableOpacity onPress={() => this._deletePhotoAlert(0)} style={styles.deleteImageView}>
								<Image source={require('../assets/Icons/delete.imageset/delete.png')} style={styles.deleteImage} />
							</TouchableOpacity>
						</Animated.View>;

		const addPhoto1 = 	<TouchableOpacity
								onPress={this.addPhoto}
								style={[styles.mainImageView, {width: SCREEN_WIDTH * 0.939, height: SCREEN_HEIGHT * 0.9, top: IMAGE1_COORD.y - SCREEN_WIDTH * 0.317, left: IMAGE1_COORD.x - SCREEN_WIDTH * 0.317}]}
							>
								<Image source={this.props.addImageSource} style={[styles.mainImage, {width: SCREEN_WIDTH * 0.939, height: SCREEN_WIDTH * 0.939, borderRadius: 0}]}/>
							</TouchableOpacity>;

		const image2 = 	<Animated.View {...this.image2PanResponder.panHandlers} style={[styles.smallImageView, this.state.image2XY.getLayout(), {zIndex: this.state.image2ZIndex, transform: [{scale: this.state.image2Scale}]}]}>
							<Animated.Image source={{uri: this.state.imageSource[1]}} style={[styles.smallImage]} />
							<TouchableOpacity onPress={() => this._deletePhotoAlert(1)} style={styles.deleteImageView}>
								<Image source={require('../assets/Icons/delete.imageset/delete.png')} style={styles.deleteImage} />
							</TouchableOpacity>
						</Animated.View>;

		const addPhoto2 = 	<TouchableOpacity
								onPress={this.addPhoto}
								style={[styles.smallImageView, {top: IMAGE2_COORD.y, left: IMAGE2_COORD.x, transform: [{scale: this.state.image2OrigScale}]}]}
							>
								<Image source={this.props.addImageSource} style={[styles.smallImage, {borderRadius: 0}]}/>
							</TouchableOpacity>;

		const image3 = 	<Animated.View {...this.image3PanResponder.panHandlers} style={[styles.smallImageView, this.state.image3XY.getLayout(), {zIndex: this.state.image3ZIndex, transform: [{scale: this.state.image3Scale}]}]}>
							<Animated.Image source={{uri: this.state.imageSource[2]}} style={[styles.smallImage]}/>
							<TouchableOpacity onPress={() => this._deletePhotoAlert(2)} style={styles.deleteImageView}>
								<Image source={require('../assets/Icons/delete.imageset/delete.png')} style={styles.deleteImage} />
							</TouchableOpacity>
						</Animated.View>;

		const addPhoto3 = 	<TouchableOpacity
								onPress={this.addPhoto}
								style={[styles.smallImageView, {top: IMAGE3_COORD.y, left: IMAGE3_COORD.x, transform: [{scale: this.state.image3OrigScale}]}]}
							>
								<Image source={this.props.addImageSource} style={[styles.smallImage, {borderRadius: 0}]}/>
							</TouchableOpacity>;

		const image4 = 	<Animated.View {...this.image4PanResponder.panHandlers} style={[styles.smallImageView, this.state.image4XY.getLayout(), {zIndex: this.state.image4ZIndex, transform: [{scale: this.state.image4Scale}]}]}>
							<Animated.Image source={{uri: this.state.imageSource[3]}} style={[styles.smallImage]}/>
							<TouchableOpacity onPress={() => this._deletePhotoAlert(3)} style={styles.deleteImageView}>
								<Image source={require('../assets/Icons/delete.imageset/delete.png')} style={styles.deleteImage} />
							</TouchableOpacity>
						</Animated.View>;

		const addPhoto4 = 	<TouchableOpacity
								onPress={this.addPhoto}
								style={[styles.smallImageView, {top: IMAGE4_COORD.y, left: IMAGE4_COORD.x, transform: [{scale: this.state.image4OrigScale}]}]}
							>
								<Image source={this.props.addImageSource} style={[styles.smallImage, {borderRadius: 0}]}/>
							</TouchableOpacity>;

		return (
			<View style={styles.background}>
				<ScrollView contentContainerStyle={{ paddingTop: SCREEN_HEIGHT * 0.091 }} showsVerticalScrollIndicator={false} ref={(ref) => this.profileScroll = ref}>
					<KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-200}>
						<View style={styles.imageGallery}>
							<View style={[styles.imageBackground, {top: IMAGE1_COORD.y, left: IMAGE1_COORD.x, transform: [{scale: 3.13}]}]} />
							<View style={[styles.imageBackground, {top: IMAGE2_COORD.y, left: IMAGE2_COORD.x}]} />
							<View style={[styles.imageBackground, {top: IMAGE3_COORD.y, left: IMAGE3_COORD.x}]} />
							<View style={[styles.imageBackground, {top: IMAGE4_COORD.y, left: IMAGE4_COORD.x}]} />
							
							{this.state.imageExists[0] ? image1 : addPhoto1}
							
							
							{this.state.imageExists[1] ? image2 : addPhoto2}
							{this.state.imageExists[2] ? image3 : addPhoto3}
							{this.state.imageExists[3] ? image4 : addPhoto4}
							
						</View>

						<View style={styles.profileBio}>
							<TextInput
								style={styles.profileBioText}
								underlineColorAndroid={'transparent'}
								editable={true}
								multiline={true}
								onChangeText ={(text) => this.setState({profileBioText: text, changesMade: true})}
								value={this.state.profileBioText}
							/>
						</View>

						<View style={styles.contactInfo}>
							<TextInput
								style={styles.contactInfoText}
								underlineColorAndroid={'transparent'}
								editable={true}
								onChangeText ={(text) => this.setState({contactInfoText: text, changesMade: true})}
								value= {this.state.contactInfoText}
							/>
						</View>
                        {/*<TouchableHighlight					--- Instagram button, unused
                            style={styles.connectInsta}
                            onPress={
                                this._connectInsta
                            }>
                            <View style={styles.connectInstaView}>
                                <Image source={require('../assets/Icons/instagram.imageset/instagram.png')}
                                       style={styles.instaLogo}/>
                                <Text style={styles.connectInstaText}>
                                    Connect Instagram
                                </Text>
                            </View>
                        </TouchableHighlight>*/}
					</KeyboardAvoidingView>
				</ScrollView>
				<ImageBackground source={require('../assets/Pngs/bg.imageset/bg.png')} style={styles.header}>
					<TouchableOpacity onPress={()=> this._exit()}>
						<View style={styles.backArrow}>
							<Image source={require('../assets/Icons/go-back-left-arrow/go-back-left-arrow.png')} style={styles.backArrowImage} />
						</View>
					</TouchableOpacity>
					<Text style={styles.title}>
						Edit Profile
					</Text>
					<TouchableOpacity onPress={()=> this._saveProfile()}>
						<Text style={styles.save}>
							Save
						</Text>
					</TouchableOpacity>
				</ImageBackground>
				<AddPhotoComponent
					isModalVisible={this.state.isModalVisible}
					updateModal={this.addPhoto}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	backArrow: {
		left: 0,
		marginRight: SCREEN_WIDTH * 0.06,
		elevation: 2,
		alignItems: 'center',
	},
	backArrowImage: {
		width: SCREEN_WIDTH * 0.07,
		height: SCREEN_WIDTH * 0.07,
	},
	background: {
		backgroundColor: '#F2F3F4',
		flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        elevation: -1,
	},
	connectInsta: {
		backgroundColor: '#FFFFFF',
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT * 0.07,
		marginTop: SCREEN_HEIGHT * 0.04,
		marginBottom: SCREEN_HEIGHT * 0.04,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		elevation: 1,
	},
	connectInstaText: {
		fontSize: SCREEN_HEIGHT * 0.0234375,
		fontFamily: 'Roboto',
	},
    connectInstaView: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        height: '100%',
        paddingLeft: SCREEN_WIDTH * 0.27,
        paddingRight: SCREEN_WIDTH * 0.27,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        elevation: 1,
    },
	contactInfo: {
		backgroundColor: '#FFFFFF',
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT * 0.07,
		marginVertical: SCREEN_HEIGHT * 0.04, // change this to marginBottom if Instagram button is used
		paddingLeft: SCREEN_WIDTH * 0.046,
		paddingRight: SCREEN_WIDTH * 0.046,
		justifyContent: 'center',
        elevation: 1,
	},
	contactInfoText: {
		color: '#8E8E93',
		fontSize: SCREEN_HEIGHT * 0.0234375,
		fontFamily: 'Roboto',
		textAlign: 'left',
	},
	deleteImage: {
		resizeMode: 'contain',
	},
	deleteImageView: {
		position: 'absolute',
		right: -SCREEN_WIDTH * 0.02,
		top: -SCREEN_WIDTH * 0.02,
		transform: [{scale: 0.33}]
	},
	header: {
		left: 0,
		flexDirection: 'row',
		alignItems: 'center',
        width: '100%',
        height: HEADER_HEIGHT,
        top: '0%',
        paddingLeft: SCREEN_WIDTH * 0.06,
        paddingRight: SCREEN_WIDTH * 0.06,
        elevation: 1,
        position: 'absolute',
	},
	imageBackground: {
		position: 'absolute',
		width: SCREEN_WIDTH * 0.3,
		height: SCREEN_WIDTH * 0.3,
		backgroundColor: '#F2F3F4',
		borderRadius: SCREEN_HEIGHT * 0.01,
	},
	imageGallery: {
		backgroundColor: '#FFFFFF',
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT * 0.78, 
        elevation: 1,
	},
	instaLogo: {

	},
	mainImage: {
		resizeMode: 'contain',
		width: SCREEN_WIDTH * 0.3,
		height: SCREEN_WIDTH * 0.3,
		borderRadius: SCREEN_HEIGHT * 0.01,
	},
	mainImageView: {
		position: 'absolute',
		width: SCREEN_WIDTH * 0.3,
		height: SCREEN_WIDTH * 0.3,
	},
	profileBio: {
		backgroundColor: '#FFFFFF',
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT * 0.16,
		marginTop: SCREEN_HEIGHT * 0.04,
		alignItems: 'center',
        justifyContent: 'center',
        elevation: 1,
        padding: SCREEN_WIDTH * 0.046,
	},
	profileBioText: {
		color: '#8E8E93',
		fontSize: SCREEN_HEIGHT * 0.0234375,
		fontFamily: 'Roboto',
	},
	smallImage: {
		resizeMode: 'contain',
		width: SCREEN_WIDTH * 0.3,
		height: SCREEN_WIDTH * 0.3,
		borderRadius: SCREEN_HEIGHT * 0.01,
	},
	smallImageView: {
		position: 'absolute',
		width: SCREEN_WIDTH * 0.3,
		height: SCREEN_WIDTH * 0.3,
	},
	save: {
		fontFamily: 'Roboto',
		fontSize: SCREEN_HEIGHT * 0.028125,
		color: '#FDD302',
		textAlign: 'right',
		elevation: 2,
	},
	title: {
		fontFamily: 'Roboto',
		fontSize: SCREEN_HEIGHT * 0.028125,
		color: 'white',
		textAlign: 'left',
		elevation: 2,
		marginRight: SCREEN_WIDTH * 0.43,
	},
});

const mapStateToProps = (state) => {
	const { user } = state;
	return { user }
};

const mapDispatchToProps = dispatch => (
	bindActionCreators({
    	saveProfileDetails,
	}, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);