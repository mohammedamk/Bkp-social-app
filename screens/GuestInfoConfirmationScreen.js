import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native';
import ProfileScreen from './ProfileScreen'

const window = Dimensions.get('window')


export default class GuestInfoConfirmationScreen extends Component {

    static navigationOptions = {
        header: null,
    };
    constructor() {
        super();
        this.state = {
            mutualFriendsData:[]
        }
    }

    componentWillMount() {
        this.setState({
            mutualFriendsData:[
                {   
                    'id':'001',
                    'mutualFriendName':'Annie Hall',
                    'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
                },
                {   
                    'id':'002',
                    'mutualFriendName':'Annie Hall',
                    'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
                },
                {   
                    'id':'003',
                    'mutualFriendName':'Annie Hall',
                    'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
                },
                {   
                    'id':'004',
                    'mutualFriendName':'Annie Hall',
                    'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
                },
                {   
                    'id':'005',
                    'mutualFriendName':'Annie Hall',
                    'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
                },
                {   
                    'id':'006',
                    'mutualFriendName':'Annie Hall',
                    'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
                },
                {   
                    'id':'007',
                    'mutualFriendName':'Annie Hall',
                    'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
                },
                {   
                    'id':'008',
                    'mutualFriendName':'Annie Hall',
                    'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
                },
                {   
                    'id':'009',
                    'mutualFriendName':'Annie Hall',
                    'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
                },
                {   
                    'id':'010',
                    'mutualFriendName':'Annie Hall',
                    'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
                },
            ]
        })
    }

    displayMutualFriends = ({item}) => {
        return(
            <View style={styles.friends}>
                <TouchableHighlight>
                    <Image source={{uri:item.imageURL}} style={styles.friendsImages}/>
                </TouchableHighlight>
                <Text style={{fontSize:window.height/50}}>Eric</Text>
            </View>
        )
    }

    render() {
      return (
        <View style={{flex:1}}>
            <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom: -window.height / 10}}>
                <ProfileScreen {...this.props}/>
            </ScrollView>
            <View style={{flexDirection:'row', backgroundColor:'transparent', height:window.height/6, width:window.width, alignItems:'center'}}>
                <View style={{flex:1, alignItems:'center'}}>
                    <TouchableOpacity>
                        <Image source={require('../assets/Icons/lock1.imageset/lock1.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, alignItems:'center'}}>
                    <TouchableOpacity>
                        <Image source={require('../assets/Icons/unlock1.imageset/unlock1.png')}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    profPicContainer: {
        width:window.width,
        height:window.height/2 + window.height/12,
    },
    profInfoContainer: {
        width:window.width,
        height:window.height/2,
        flexDirection:'column',
    },
    locks:{
        width:window.width,
        backgroundColor:'red'
    },
    images:{
        width:'100%',
        height:'100%',
    },
    nameAge:{
        flex:2,
        flexDirection:'row',
    },
    description:{
        flex:3.25,
    },
    mutualFriends:{
        flex:9,
        flexDirection: 'column',
    },
    friends:{
        flexDirection:'column',
        alignItems:'center',
        height:window.height/8,
        width: window.height/9,
        justifyContent:'flex-end',
        marginLeft:-5,
    },
    friendsImages:{
        height:window.height/10.5,
        width:window.height/10.5,
        borderRadius:5
    },
})