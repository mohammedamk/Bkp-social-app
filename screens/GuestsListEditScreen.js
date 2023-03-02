import React, {Component} from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const window = Dimensions.get('window')

export default class GuestsListEditScreen extends Component {
    static navigationOptions = {
        header: null,
      };

    constructor({navigation}) {
        super();
        this.state = {
            guestsListData: navigation.getParam('guests', 'No guest'),
            checked:true,
            selected:false,
            checkBox:[]
        }
    }

    // componentDidMount() {
    //     var newCheckBox = {}
    //     for (var i = 0; i<this.state.guestsListData.length; i++) {
    //         newCheckBox[this.state.guestsListData[i].id] = false;
    //         if (i == this.state.guestsListData.length - 1) {
    //             this.setState({
    //                 checkBox: newCheckBox
    //             })
    //         }
    //     }
        
    // }

    displayGuestsList = ({item}) => {
        return(
                <View style={{height:window.height/8, flexDirection:'column'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: 60}}>
                        <View style={{flex:2, alignItems:'center'}}>
                            <View style={{width:window.width/7, height:window.width/7}}>
                                <Image style={{width:'100%', height:'100%', borderRadius:window.width, resizeMode:'cover'}} source={{uri: item.imageURL}}/>
                            </View>
                        </View>
                        <View style={{flex:5, alignItems:'flex-start'}}>
                            <Text style={{fontWeight: 'bold', fontSize: window.height / 40}}>{item.guestName}</Text>
                        </View>
                        <View style={{flex:1, alignItems:'center'}}>
                            <TouchableOpacity style={{width:window.height/34, height:window.height/34}}
                            onPress={() => {
                                // this.state.checkBox[item.id] = !this.state.checkBox[item.id];
                                // console.log(this.state.checkBox[item.id]);
                                // this.setState({
                                //     checkBox: this.state.checkBox
                                // })
                                if (this.state.checkBox.indexOf(item.id) >= 0) {
                                    this.state.checkBox.splice(this.state.checkBox.indexOf(item.id), 1 )
                                    this.setState({
                                        checkBox: this.state.checkBox
                                    })
                                } else {
                                    this.state.checkBox.push(item.id)
                                    this.setState({
                                        checkBox: this.state.checkBox
                                    })
                                }
                            }}
                            >
                                <Image style={{width:'100%', height:'100%'}} source={
                                    (this.state.checkBox.indexOf(item.id) >= 0) ? require('../assets/Icons/selectContact.imageset/checked.png') : require('../assets/Icons/selectContact.imageset/unchecked.png')
                                    // () => {
                                    //     if (this.state.checkBox.indexOf(item.id) >= 0) {
                                    //         return require('../assets/checkbox2.jpg')
                                    //     } else {
                                    //         return require('../assets/checkbox3.jpg')
                                    //     }
                                    // }
                                    
                                }/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex:1, alignItems:'flex-end'}}>
                        <View style={{flex:1, backgroundColor:'#A9A9A9', width:'95%'}}></View>
                    </View>
                </View>
        )
    }

    render() {
        const {navigation} = this.props;
        return(
            <View style={{flex:1}}>
                <View style={{flex:1}}>
                    <ImageBackground
                        source={require('../assets/background.png')}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <View style={styles.container}>
                            <View style={styles.headerContainer}>
                                <View style={{flex:1, alignItems:'center'}}>
                                    <Image style={{width:window.height/34, height:window.height/34, resizeMode:'contain'}} source={require('../assets/Icons/selectContact.imageset/checked.png')}/>
                                </View>
                                <View style={{flex:5, alignItems:'flex-start'}}>
                                    <Text style={{
                                        color: 'white',
                                        fontSize: window.height / 40
                                    }}>{this.state.checkBox.length} Selected</Text>
                                </View>
                                <View style={{flex:1, alignItems:'flex-start'}}>
                                    <TouchableOpacity
                                        onPress = {(this.state.checkBox.length > 0)
                                        ? () => {
                                            Alert.alert('', 'Sure you want to delete selected users?', [
                                                {text:'CANCEL', onPress: () => console.log('You cancelled')},
                                                {text:'YES', onPress: () => {
                                                    for (i=0;i<this.state.guestsListData.length;i++) {
                                                        if (this.state.checkBox.indexOf(this.state.guestsListData[i].id) >= 0) {
                                                            this.state.guestsListData.splice(i, 1)
                                                            i--;
                                                            // this.state.guestsListData.splice( this.state.guestsListData.indexOf(this.state.checkBox.indexOf(this.state.guestsListData[i].id)), 1 );
                                                        }
                                                        
                                                    }
                                                    this.setState({
                                                        guestsListData: this.state.guestsListData,
                                                        checkBox: []
                                                    })
                                                }}
                                            ])
                                        }: () => {
                                                this.props.navigation.navigate('GuestsList', {guestsRemain: this.state.guestsListData})
                                        }}
                                    >
                                        <Text style={{
                                            color: 'yellow',
                                            fontSize: window.height / 40
                                        }}>{(this.state.checkBox.length > 0) ? 'Delete' : 'Done'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flex:9, backgroundColor:'white'}}>
                                <FlatList
                                    data={this.state.guestsListData}
                                    renderItem={this.displayGuestsList}
                                    numColumns={1}
                                    keyExtractor={(item, index) => item.id.toString()}
                                    extraData={this.state}
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
    container:{
        flex:1,
        flexDirection:'column',
    },
    headerContainer:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
    },
})