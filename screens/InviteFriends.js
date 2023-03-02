import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    SectionList,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {Contacts, Permissions} from 'expo';

//TODOS: create method for searching 


export default class InviteFriends extends Component {

    constructor() {
        super();
        // Usage of states:
        // myContacts - base array with all contacts
        // shownContacts - initially equal to myContacts. will change depending on search parameters
        // search - bool to show/hide search bar. NOTE: currently unused
        // numSelectedContacts - shows number of currently select contacts at invite friends button at the bottom
        // selectedContactsList - list of currently select contacts to send.
        // allContactsSelected - bool whether 'Select All' contacts button has been used
        // allNumber - number of all contacts in an array for 'Select All' purposes
        this.state = {
            headerLeftImg: require('../assets/Icons/go-back-left-arrow/go-back-left-arrow.png'),
            contactUnselected: require('../assets/Icons/selectContact.imageset/unchecked.png'),
            contactSelected: require('../assets/Icons/selectContact.imageset/checked.png'),
            headerLeftText: 'Invite Friends',
            myContacts: [],
            shownContacts: [],
            search: false,
            numSelectedContacts: 0,
            selectedContactsList: [],
            allContactsSelected: false,
            allNumbers: [],
            hideSelectAll: 1,
        }
        this.getContactAsync();
        this.getAllNumbers = this.getAllNumbers.bind(this);


    }

    static navigationOptions = {
        header: null,
    };

    sendSMS = async () => {
        const { Permissions } = Expo;
        const { status } = await Permissions.askAsync(Permissions.SMS);
        const isAvailable = await Expo.SMS.isAvailableAsync();
        if (status === 'granted') {
            if (isAvailable) {
                Expo.SMS.sendSMSAsync(this.state.selectedContactsList, 'I just made an event on Rendevous. Go download Rendevous so you can swipe on my event');
                this.setState({ selectedContactsList: [] });
            } else {
                alert('No SMS available on this device');
            }
        }
        else {
            throw new Error('SMS Permission not granted');
        }

    }

    async getContactAsync() {
        // Ask for permission to query contacts.
        const permission = await Permissions.askAsync(Permissions.CONTACTS);

        // if (permission.status !== 'granted') {
        //     // Permission was denied...
        //     return;
        // }
        const contacts = await Contacts.getContactsAsync();
        // console.log(contacts);
        var temp = [];
        var tempdata = [];
        var headerString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var primaryNumSaved = false;
        var allNumbers = [];

        var test = 0;
        //loop thru alphabet string a letter at a time
        for (indx in headerString) {
            //loop thru each contact
            for (item in contacts.data) {

                // console.log(contacts.data[item] instanceof Object);
                // if (typeof contacts.data[item].phoneNumbers == 'undefined') break;


                //if contact has a phone number saved, proceed, else ignore
                if (typeof contacts.data[item].phoneNumbers != 'undefined' && contacts.data[item].phoneNumbers.length != 0) {
                    //if contact name first letter in uppercase is same as current letter being looped
                    if (contacts.data[item].name[0].toUpperCase() == headerString[indx]) {
                        //if contact only has 1 number, use number
                        if (contacts.data[item].phoneNumbers.length == 1) {
                            tempdata.push({
                                name: contacts.data[item].name,
                                phone: contacts.data[item].phoneNumbers[0].number,
                                id: contacts.data[item].id,
                            });
                            allNumbers.push(contacts.data[item].phoneNumbers[0].number);
                        } else if (contacts.data[item].phoneNumbers.length > 1) {
                            //if contact has more than 1 number saved, look if there is a primary assigned,
                            //else get the first number in the array
                            // TODO: ask Austin how he wants to this to behave and update function to include numbers and symbols
                            for (c in contacts.data[item].phoneNumbers) {
                                if (contacts.data[item].phoneNumbers[c].isPrimary == 1) {
                                    tempdata.push({
                                        name: contacts.data[item].name,
                                        phone: contacts.data[item].phoneNumbers[c].number,
                                        id: contacts.data[item].id,
                                    });
                                    allNumbers.push(contacts.data[item].phoneNumbers[c].number);
                                    primaryNumSaved = true;
                                }
                            }
                            if (primaryNumSaved == false) {
                                tempdata.push({
                                    name: contacts.data[item].name,
                                    phone: contacts.data[item].phoneNumbers[0].number,
                                    id: contacts.data[item].id,
                                });
                                allNumbers.push(contacts.data[item].phoneNumbers[0].number);
                            }
                            primaryNumSaved = false;
                        }
                    }
                }
            }
            if (tempdata.length != 0) {
                temp.push({ head: headerString[indx], data: tempdata });
                tempdata = [];
            }
        }
        this.setState({
            myContacts: temp,
            shownContacts: temp,
            allNumbers: allNumbers
        })
    }

    // View for each contact
    // onPress - if contact number is in selectedContactsList, remove it. if not, add it.
    //           then get number of items in selectedContactsList and setState of numSelectedContacts
    showContacts = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => {
                if (this.state.selectedContactsList.includes(item.phone)) {
                    this.state.selectedContactsList.splice(this.state.selectedContactsList.indexOf(item.phone), 1)
                } else {
                    this.state.selectedContactsList.push(item.phone)
                }
                this.setState({
                    numSelectedContacts: this.state.selectedContactsList.length,
                    allContactsSelected: false,
                })
            }}>
                <View key={index} style={styles.contactViews}>
                    <Text style={{ fontSize: width / 20, marginLeft: width * 0.04 }}>{item.name}</Text>
                    <Text style={{ fontSize: width / 30, marginLeft: width * 0.04 }}>{item.phone}</Text>
                    <Image style={{ position: 'absolute', right: width * 0.07, top: 0, bottom: 0, width: width * 0.05, resizeMode: 'contain' }}
                        source={this.state.selectedContactsList.includes(item.phone) ? this.state.contactSelected : this.state.contactUnselected} />
                </View>
            </TouchableOpacity>
        )
    }

    // Letter header for contacts. example: A for contacts starting with names that start with A
    showContactsHeaders = (item) => {
        return (
            <View style={styles.contactHeader}>
                <Text style={{ fontSize: width / 20, fontWeight: 'bold', marginLeft: width * 0.04 }}>{item.section.head}</Text>
            </View>
        )
    }

    searchContacts = (value) => {
        var trggr = false;
        var contacts = [];
        var filtered = [];

        console.log(value === "a");


        if (value != null && value !== "") {
            this.setState({
                hideSelectAll: 0,
            });
            for (a in this.state.myContacts) {
                for (c in this.state.myContacts[a].data) {
                    // console.log(this.state.myContacts[a].data[c].name);
                    if (this.state.myContacts[a].data[c].name.toLowerCase().includes(value.toLowerCase())) {
                        contacts.push(this.state.myContacts[a].data[c]);
                        trggr = true;
                    }
                }
                if (trggr) {
                    filtered.push({ head: this.state.myContacts[a].head, data: contacts });
                }
                contacts = [];
                trggr = false;
            }
            this.setState({
                shownContacts: filtered
            });
        } else if (value === "") {
            this.setState({
                hideSelectAll: 1,
            });
        } else {
            this.setState({
                shownContacts: this.state.myContacts,
            })
        }
    }

    // return a new allNumbers array every time 'Select All' is pressed
    getAllNumbers = () => {
        var allNum = [];
        for (num in this.state.allNumbers) {
            allNum.push(this.state.allNumbers[num])
        }
        return allNum
    }

    render() {
        return (
            <ImageBackground style={styles.background} source={require('../assets/Pngs/bg.imageset/bg.png')}>
                {/* Header Bar */}
                <View style={styles.header}>
                    {/* Left Header Side */}
                    <View style={styles.leftHeader}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image style={styles.headerLeftImage} source={this.state.headerLeftImg} />
                        </TouchableOpacity>
                        <Text style={styles.headerLeftText}>{this.state.headerLeftText}</Text>
                    </View>

                    {/* Right Header Side */}
                    {this.state.hideSelectAll === 1 &&
                        <View style={[styles.rightHeader]}>
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    selectedContactsList: this.state.allContactsSelected ? [] : this.getAllNumbers(),
                                    allContactsSelected: this.state.allContactsSelected ? false : true,
                                    numSelectedContacts: this.state.allContactsSelected ? 0 : this.state.allNumbers.length,
                                })
                            }}>
                                <Text style={styles.headerRightText}>{!this.state.allContactsSelected ? "Select All" : "Unselect All"}</Text>
                            </TouchableOpacity>
                        </View>}

                    {/* NOTE: Old left header with select all and search button. Kept just in case */}
                    {/* <View style={styles.rightHeader}>
                        <TouchableOpacity onPress={() => { console.log('Before ' + this.state.search); }}>
                            <Image style={styles.headerMultiSelect} source={require('../assets/Icons/multiselect.imageset/multiselect.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                search: this.state.search ? false : true
                            })
                            this.openSearch();
                        }}>
                            <Image style={styles.headerMultiSelect} source={require('../assets/Icons/search.imageset/search.png')} />
                        </TouchableOpacity>
                    </View> */}
                </View>

                {/* Search Bar */}
                <View style={styles.searchBarContainer}>
                    <View style={styles.searchBar}>
                        <Image style={{ width: width * 0.05, height: width * 0.05, marginLeft: width * 0.02 }}
                            source={require('../assets/Icons/search.imageset/searchgrey.png')} />
                        <TextInput style={{ width: width * 0.87, fontSize: width / 20, marginLeft: width * 0.03, paddingRight: width * 0.02 }} placeholder={'Search'}
                            underlineColorAndroid={'transparent'} onChangeText={(value) => { this.searchContacts(value) }} />
                    </View>
                </View>

                {/* Contacts Section List */}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <SectionList
                        initialNumToRender={100}
                        renderItem={this.showContacts}
                        sections={this.state.shownContacts}
                        keyExtractor={(item, index) => { return item + index }}
                        renderSectionHeader={this.showContactsHeaders}
                    />
                </View>

                {/*Invite Friends Button*/}
                <View style={styles.sendInviteButton}>
                    <TouchableOpacity onPress={() => this.sendSMS()}>
                        <View style={styles.sendInviteButtonTouch}>
                            <View style={styles.selectCounterBg}>
                                <Text style={styles.selectCounter}>{this.state.numSelectedContacts}</Text>
                            </View>
                            <Text style={styles.sendInviteText}>Invite Friends</Text>
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
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        height: height * .08,
        width: width,
        marginTop: StatusBar.currentHeight
    },
    leftHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    headerLeftImage: {
        height: height / 30,
        width: height / 30,
        margin: width * 0.045,
    },
    headerLeftText: {
        color: 'white',
        fontSize: width / 19,
    },
    headerRightText: {
        color: 'white',
        fontSize: width / 19,
    },
    rightHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginRight: width * 0.03,
    },
    headerMultiSelect: {
        height: height / 40,
        width: height / 40,
        margin: width * 0.02,
    },
    headerSearch: {
        height: height / 40,
        width: height / 40,
    },
    searchBarContainer: {
        backgroundColor: '#B8B8B8',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height * 0.05,
    },
    searchBar: {
        backgroundColor: 'white',
        flexDirection: 'row',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactViews: {
        flex: 1,
        justifyContent: 'center',
        width: width,
        height: height * 0.1,
        backgroundColor: 'white',
    },
    contactHeader: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        height: height * 0.05
    },
    sendInviteButton: {
        width: width,
        height: height * 0.08,
        backgroundColor: '#FDD302',
    },
    sendInviteButtonTouch: {
        flexDirection: 'row',
        width: width,
        height: height * 0.08,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectCounterBg: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        width: width * 0.12,
        borderRadius: 20,
        marginRight: width * 0.01
    },
    selectCounter: {
        color: '#FDD302',
        fontSize: width / 20,
    },
    sendInviteText: {
        color: 'white',
        fontSize: width / 20,

    },
});