import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    ListView,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const dummyMessages = [
	{
		name: 'Annie Hall',
		date: new Date(2018, 10, 2, 19, 30),
		photo: require('../assets/Pngs/profilePhoto.imageset/profilePhoto.png'),
		chat: 'Lorem ipsum dolor sit amet',
	},
	{
		name: 'Jodee Furrow',
		date: new Date(2018, 10, 2, 18, 30),
		photo: require('../assets/Pngs/profilePhoto.imageset/profilePhoto.png'),
		chat: 'Lorem ipsum dolor sit amet',
	},
	{
		name: 'Karl Nyland',
		date: new Date(2018, 10, 2, 17, 25),
		photo: require('../assets/Pngs/profilePhoto.imageset/profilePhoto.png'),
		chat: 'Lorem ipsum dolor sit amet',
	},
	{
		name: 'Hot tub and bear',
		date: new Date(2018, 10, 1, 18, 30),
		photo: require('../assets/Pngs/profilePhoto.imageset/profilePhoto.png'),
		chat: 'Lorem ipsum dolor sit amet',
	},
	{
		name: 'Jack Ahlers',
		date: new Date(2018, 9, 30, 18, 30),
		photo: require('../assets/Pngs/profilePhoto.imageset/profilePhoto.png'),
		chat: 'Lorem ipsum dolor sit amet',
	},
	{
		name: 'Ehtel Wolfram',
		date: new Date(2018, 7, 25, 18, 30),
		photo: require('../assets/Pngs/profilePhoto.imageset/profilePhoto.png'),
		chat: 'Lorem ipsum dolor sit amet',
	},
	{
		name: 'Fake Name',
		date: new Date(2018, 6, 2, 18, 30),
		photo: require('../assets/Pngs/profilePhoto.imageset/profilePhoto.png'),
		chat: 'Lorem ipsum dolor sit amet',
	},
	{
		name: 'Test User',
		date: new Date(2018, 4, 15, 18, 30),
		photo: require('../assets/Pngs/profilePhoto.imageset/profilePhoto.png'),
		chat: 'Lorem ipsum dolor sit amet',
	},
];

export default class MessagesScreen extends Component {
	constructor(props) {
		super(props);
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		})
		this.state = {
			messagesDataSource: ds.cloneWithRows(dummyMessages)
		}
		this.pressRow = this.pressRow.bind(this);
		this.renderRow = this.renderRow.bind(this);
	}

	static navigationOptions = {
		header: null,
	};

	static defaultProps = {

	};

	parseDate(date) {
		var currentDate = new Date();
		if (!(date.getYear() < currentDate.getYear())) {
			if (!(date.getMonth() < currentDate.getMonth())) {
				if (date.getDate() === currentDate.getDate()) 
					return date.toString().slice(16, 21);
				else if (currentDate.getDate() - date.getDate() === 1)
					return 'Yesterday';
			}
		}
		return date.toDateString().slice(4, 10);
	}

	pressRow(rowID) {
		this.props.navigation.navigate('ChatRoom');
	}

	renderRow(message, sectionID, rowID, highlightRow) {
		return (
			<TouchableHighlight onPress={() => {
				this.pressRow(rowID);
				highlightRow(sectionID, rowID);
			}}
			style={
				{backgroundColor: '#F2F3F4',}
			}>
				<View style={styles.message}>
					<Image style={styles.messagePhoto} source={message.photo} />
					<View style={styles.messageTextView}>
						<View style={styles.nameAndDateView}>
							<Text style={styles.messageName}>{message.name}</Text>
							<Text style={styles.messageDate}>{this.parseDate(message.date)}</Text>
						</View>
						<Text style={styles.messageChat}>{message.chat}</Text>
					</View>
				</View>
			</TouchableHighlight>
		)
	}

	render() {
		return (
			<View style={styles.background}>
				<ListView
					contentContainerStyle={{ paddingTop: SCREEN_HEIGHT * 0.091 }}
					showsVerticalScrollIndicator = {false}
					dataSource = {this.state.messagesDataSource}
					renderRow={this.renderRow}
					style={styles.messageListView}
				/>
				<ImageBackground source={require('../assets/Pngs/bg.imageset/bg.png')} style={styles.header}>
					<TouchableOpacity onPress={() => this.props.navigation.navigate('Guest')}>
						<Image source={require('../assets/Icons/go-back-left-arrow/go-back-left-arrow.png')} style={styles.backArrowImage} />
					</TouchableOpacity>
					<Text style={styles.title}>
						Messages
					</Text>
				</ImageBackground>
				<TouchableOpacity onPress={() => console.log('Compose Message Pressed')} style={styles.composeMessage}>
					<Image source={require('../assets/Icons/compose-message/compose-message.png')} style={styles.composeMessageImage}/>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	backArrowImage: {
		left: 0,
		marginRight: SCREEN_WIDTH * 0.06,
		width: SCREEN_WIDTH * 0.07,
		height: SCREEN_WIDTH * 0.07,
	},
	background: {
		backgroundColor: '#F2F3F4',
		flex: 1,
		flexDirection: 'column',
	},
	composeMessage: {
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		right: SCREEN_WIDTH * 0.0625,
		bottom: SCREEN_WIDTH * 0.0625,
		width: SCREEN_WIDTH * 0.2,
		height: SCREEN_WIDTH * 0.2,
		overflow: 'visible',
	},
	composeMessageImage: {
		width: SCREEN_WIDTH * 0.18,
		height: SCREEN_WIDTH * 0.18,
	},
	header: {
		left: 0,
		flexDirection: 'row',
		alignItems: 'center',
        width: '100%',
        height: SCREEN_HEIGHT * 0.091,
        top: '0%',
        paddingLeft: SCREEN_WIDTH * 0.06,
        paddingRight: SCREEN_WIDTH * 0.06,
        elevation: 1,
        position: 'absolute',
	},
	message: {
		flexDirection: 'row',
		padding: SCREEN_WIDTH * 0.042,
		height: SCREEN_HEIGHT * 0.1375,
		width: '100%',
		alignItems: 'center',
		borderStyle: 'solid',
		borderColor: '#E8E8E8',
		borderBottomWidth: 2,
		backgroundColor: '#F2F3F4',
	},
	messageChat: {
		fontFamily: 'Roboto',
		color: '#787878',
		fontSize: SCREEN_HEIGHT * 0.025,
	},
	messageDate: {
		fontFamily: 'Roboto',
		color: '#868686',
		fontSize: SCREEN_HEIGHT * 0.025,
		textAlign: 'right',
	},
	messageListView: {
		backgroundColor: '#F2F3F4',
		flex: 1,
	},
	messageName: {
		fontFamily: 'Roboto',
		color: 'black',
		fontSize: SCREEN_HEIGHT * 0.025,
		fontWeight: 'bold',
	},
	messagePhoto: {
		width: SCREEN_WIDTH * 0.125,
		height: SCREEN_WIDTH * 0.125,
		borderRadius: 90,
		marginRight: SCREEN_WIDTH * 0.042,
	},
	messageTextView: {
		flexDirection: 'column',
	},
	nameAndDateView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: SCREEN_WIDTH * 0.736,
	},
	title: {
		fontFamily: 'Roboto',
		fontSize: SCREEN_HEIGHT * 0.028125,
		color: 'white',
		textAlign: 'left',
	},
});