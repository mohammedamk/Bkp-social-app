import React, { Component } from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Image,
  ImageBackground,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import LocksComponent from "../components/LocksComponent";
import Layout from "../constants/Layout";
import EventCreationComponent from '../components/EventCreationComponent.js';
import Swiper from 'react-native-swiper';
import Modal from 'react-native-modalbox';

const SCREEN_HEIGHT = Layout.window.height;
const SCREEN_WIDTH = Layout.window.width;
const window = Dimensions.get('window')


export default class GuestConfirmationScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.eventCreationTop = new Animated.Value(1);
    this.position = new Animated.ValueXY();
    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-25deg', '0deg', '25deg'],
      extrapolate: 'clamp'
    });
    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    };

    this.state = {
      showCard: true,
      imageIndex: 0,
      array: [
        { 'img': require('../assets/Pngs/girlphoto.imageset/girlphoto.png') },
        { 'img': require('../assets/Pngs/girlphoto.imageset/girlphoto.png') },
        { 'img': require('../assets/Pngs/girlphoto.imageset/girlphoto.png') },
        { 'img': require('../assets/Pngs/girlphoto.imageset/girlphoto.png') },
        { 'img': require('../assets/Pngs/girlphoto.imageset/girlphoto.png') },
        { 'img': require('../assets/Pngs/girlphoto.imageset/girlphoto.png') },
      ],
      isMoving: false,
      eventCreationHidden: true,
      activeProfile: null,
      mutualFriendsData: [
        {
          'id': '001',
          'mutualFriendName': 'Annie Hall',
          'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
        },
        {
          'id': '002',
          'mutualFriendName': 'Annie Hall',
          'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
        },
        {
          'id': '003',
          'mutualFriendName': 'Annie Hall',
          'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
        },
        {
          'id': '004',
          'mutualFriendName': 'Annie Hall',
          'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
        },
        {
          'id': '005',
          'mutualFriendName': 'Annie Hall',
          'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
        },
        {
          'id': '006',
          'mutualFriendName': 'Annie Hall',
          'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
        },
        {
          'id': '007',
          'mutualFriendName': 'Annie Hall',
          'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
        },
        {
          'id': '008',
          'mutualFriendName': 'Annie Hall',
          'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
        },
        {
          'id': '009',
          'mutualFriendName': 'Annie Hall',
          'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
        },
        {
          'id': '010',
          'mutualFriendName': 'Annie Hall',
          'imageURL': 'https://amp.businessinsider.com/images/5899ffcf6e09a897008b5c04-750-750.jpg'
        },
      ]
    }

  }

  componentWillMount() {
    this.allProfiles = {};
    this.oldPosition = {};
    this.newViewPosition = new Animated.ValueXY();
    this.dimensions = new Animated.ValueXY();
    this.animation = new Animated.Value(0);

    this.allProfileImages = {};
    this.oldImagePosition = {};
    this.newImagePosition = new Animated.ValueXY();
    this.imageDimensions = new Animated.ValueXY();
    this.imageAnimation = new Animated.Value(0);

    this.imagePanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (e, gestureState) => {
        if (
          Platform.OS == 'android'
          && (gestureState.dx < 2 && gestureState.dx > -2)
          && (gestureState.dy < 2 && gestureState.dy > -2)
        ) {
          return false;
        }

        return true;
      },
      onPanResponderMove: (evt, gs) => {
        this.setState({ isMoving: true })
        // console.log('MOVING', gs.dx, gs.dy)
        // this.imageXPos.setValue(gs.dx)
        this.position.setValue({ x: gs.dx, y: gs.dy })
      },
      onPanResponderRelease: (evt, gs) => {
        console.log('RELEASED');
        this.setState({ isMoving: false })
        if (gs.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gs.dy }
          }).start(() => {
            this.setState({
              imageIndex: this.state.imageIndex + 1
            }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        } else if (gs.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gs.dy }
          }).start(() => {
            this.setState({
              imageIndex: this.state.imageIndex + 1
            }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        } else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start()
        }
      }
    });
  }

  _toggleEventCreation = () => {
  //  alert("hu")
    const opposite = !this.state.eventCreationHidden;
    this.setState({
      eventCreationHidden: opposite,
    });

    if (this.state.eventCreationHidden) {
      this.setState({ showCard: false })
    } else {
      this.setState({ showCard: true })
    }

    const theValue = this.state.eventCreationHidden ? 0 : 1;
    Animated.timing(this.eventCreationTop, {
      toValue: theValue,
      duration: 500,
      easing: Easing.ease,
    }).start();

  }

  lock = () => {
    console.log('lock!')
    Animated.spring(this.position, {
      toValue: { x: -SCREEN_WIDTH - 400, y: SCREEN_HEIGHT / 4 }
    }).start(() => {
      this.setState({
        imageIndex: this.state.imageIndex + 1
      }, () => {
        this.position.setValue({ x: 0, y: 0 })
      })
    })
  }
  unlock = () => {
    console.log('unlock!')
    Animated.spring(this.position, {
      toValue: { x: SCREEN_WIDTH + 400, y: SCREEN_HEIGHT / 4 }
    }).start(() => {
      this.setState({
        imageIndex: this.state.imageIndex + 1
      }, () => {
        this.position.setValue({ x: 0, y: 0 })
      })
    })
  }

  openProfile = index => {
   // alert("hi");
    // Tracking Card View position
    this.allProfiles[index].measure((x, y, width, height, pageX, pageY) => {
      this.oldPosition.x = pageX;
      this.oldPosition.y = pageY;
      this.oldPosition.width = width;
      this.oldPosition.height = height;

      this.newViewPosition.setValue({
        x: pageX,
        y: pageY
      })
      this.dimensions.setValue({
        x: width,
        y: height
      })
      // Tracking image position
      this.allProfileImages[index].measure((ix, iy, iwidth, iheight, ipageX, ipageY) => {
        this.oldImagePosition.x = ipageX - pageX;
        this.oldImagePosition.y = ipageY - pageY;
        this.oldImagePosition.width = iwidth;
        this.oldImagePosition.height = iheight;
        this.newImagePosition.setValue({
          x: ipageX - pageX,
          y: ipageY - pageY
        });
        this.imageDimensions.setValue({
          x: iwidth,
          y: iheight
        });
        this.setState({
          activeProfile: this.state.array[index]
        }, () => {
          this.viewProfile.measure((dx, dy, dWidth, dHeight, dPageX, dPageY) => {
            // console.log('bf',dPageX)
            // console.log('bf',dPageY)
            // console.log('bf',dWidth)
            // console.log('bf',dHeight)
            Animated.parallel([
              Animated.timing(this.newViewPosition.x, {
                toValue: dPageX,
                duration: 300
              }),
              Animated.timing(this.newViewPosition.y, {
                toValue: dPageY,
                duration: 300
              }),
              Animated.timing(this.dimensions.x, {
                toValue: dWidth,
                duration: 300
              }),
              Animated.timing(this.dimensions.y, {
                toValue: dHeight,
                duration: 300
              }),
              Animated.timing(this.animation, {
                toValue: 1,
                duration: 300
              }),
              Animated.timing(this.newImagePosition.x, {
                toValue: dPageX,
                duration: 300
              }),
              Animated.timing(this.newImagePosition.y, {
                toValue: dPageY,
                duration: 300
              }),
              Animated.timing(this.imageDimensions.x, {
                toValue: dWidth,
                duration: 300
              }),
              Animated.timing(this.imageDimensions.y, {
                toValue: window.height / 2 + window.height / 12,
                duration: 300
              }),
              Animated.timing(this.imageAnimation, {
                toValue: 1,
                duration: 300
              })
            ]).start();
          })
        })
      })
    })
  }

  openModal = () => {
    this.refs.modal4.open()
  }

  closeImage = () => {
    Animated.parallel([
      Animated.timing(this.newViewPosition.x, {
        toValue: this.oldPosition.x,
        duration: 300
      }),
      Animated.timing(this.newViewPosition.y, {
        toValue: this.oldPosition.y,
        duration: 300
      }),
      Animated.timing(this.dimensions.x, {
        toValue: this.oldPosition.width,
        duration: 300
      }),
      Animated.timing(this.dimensions.y, {
        toValue: this.oldPosition.height,
        duration: 300
      }),
      Animated.timing(this.animation, {
        toValue: 0,
        duration: 300
      }),

      Animated.timing(this.newImagePosition.x, {
        toValue: this.oldImagePosition.x,
        duration: 300
      }),
      Animated.timing(this.newImagePosition.y, {
        toValue: this.oldImagePosition.y,
        duration: 300
      }),
      Animated.timing(this.imageDimensions.x, {
        toValue: this.oldImagePosition.width,
        duration: 300
      }),
      Animated.timing(this.imageDimensions.y, {
        toValue: this.oldImagePosition.height,
        duration: 300
      }),
      Animated.timing(this.imageAnimation, {
        toValue: 0,
        duration: 300
      })
    ]).start(() => {
      this.setState({
        activeProfile: null
      })
    })
  }

  renderImage = () => {
    return this.state.array.map((item, i) => {
      if (i < this.state.imageIndex) {
        return null
      }
      else if (i === this.state.imageIndex) {
        return (

          <Animated.View
            {...this.imagePanResponder.panHandlers}
            key={i}
            style={[this.rotateAndTranslate, styles.cardContainer]}
          >
            <TouchableWithoutFeedback style={styles.touchableCard}
              onPress={() => this.openProfile(i)}
            // onPress={() => this.props.navigation.navigate('GuestInfoConfirmation', {
            //   message:true
            // })}
            >
              <View
                style={styles.touchableCard}
                ref={(profile) => (this.allProfiles[i] = profile)}
              >
                <Image
                  style={styles.profileImage}
                  source={item.img}
                  ref={(profileImage) => (this.allProfileImages[i] = profileImage)}
                />
                <View>
                  <Text style={{ fontFamily: 'Roboto', fontSize: 25, color: '#505050' }}>Scarlett, 31</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>

        )
      }
      else {
        return (
          <Animated.View
            key={i}
            style={styles.cardContainer}
          >
            <Image style={styles.profileImage} source={item.img} />
            <Text style={{ fontFamily: 'Roboto', fontSize: 25, color: '#505050' }}>Scarlett, 31</Text>
          </Animated.View>
        )
      }
    }).reverse();
  }

  displayMutualFriends = ({ item }) => {
    return (
      <View style={styles.friends}>
        <TouchableHighlight>
          <Image source={{ uri: item.imageURL }} style={styles.friendsImages} />
        </TouchableHighlight>
        <Text style={{ fontSize: window.height / 50 }}>Eric</Text>
      </View>
    )
  }

  guestLock = () => {
    this.closeImage();
    setTimeout(() => {
      this.lock();
    }, 1000);
  }

  guestUnlock = () => {
    this.closeImage();
    setTimeout(() => {
      this.unlock();
    }, 1000);
  }

  render() {
    const eventCreationInterpolate = this.eventCreationTop.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"]
    })

    const eventCreationStyle = {
      top: eventCreationInterpolate,
    }

    const activeProfileStyle = {
      width: this.dimensions.x,
      height: this.dimensions.y,
      left: this.newViewPosition.x,
      top: this.newViewPosition.y
    }

    const activeImageStyle = {
      width: this.imageDimensions.x,
      height: this.imageDimensions.y,
      left: this.newImagePosition.x,
      top: this.newImagePosition.y
    }

    return (
      <ImageBackground style={styles.background} source={require('../assets/Pngs/bg.imageset/bg.png')}>
        {this.state.showCard && <View style={styles.header}>
          <View style={styles.menu1}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('UserCalender')}>
              <View style={styles.backArrow}>
                <Image source={require('../assets/Icons/go-back-left-arrow/go-back-left-arrow.png')}
                  style={styles.backArrowImage} />
              </View>
            </TouchableOpacity>
            <View style={{
              width: SCREEN_WIDTH * 0.6,
              height: '100%',
              alignItems: 'flex-start',
              justifyContent: 'center',
              marginLeft: 30
            }}>
              <Text style={{ color: 'white', fontFamily: 'Roboto', fontSize: 20, }}>Amazing friday
                                night</Text>
              <Text style={{ color: 'white', fontFamily: 'Roboto', fontSize: 13, }}>sat, 10:00pm, Sep
                                26</Text>
            </View>



          </View>
          <View style={styles.menu2}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Messages')}>
              <Image style={{ width: 26, height: 24 }}
                source={require('../assets/Icons/not_message.imageset/not_message.png')} />
              {/* <Image style={{width:24,height:24, marginLeft:15}} source={require('../assets/Icons/event_yellow/calendar.png')} /> */}
            </TouchableOpacity>
          </View>
        </View>}

        <Modal onBackdropPress={() => console.log('Modal')} style={styles.modal} position={"center"} ref={"modal4"} isDisabled={this.state.isDisabled}>
          <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', backgroundColor: '#5bb983', width: "100%", height: SCREEN_HEIGHT * (73 / 1332), borderTopRightRadius: 5, borderTopLeftRadius: 5 }}><Text style={{ color: 'white', fontSize: SCREEN_HEIGHT * (30 / 1332) }}>Warning</Text></View>
          <Text style={{ fontSize: SCREEN_HEIGHT * (30 / 1332) }}>Please fill out the required fields.</Text>
          <TouchableOpacity onPress={() => this.refs.modal4.close()}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: '#fdd302', width: SCREEN_WIDTH * (502 / 748), height: SCREEN_HEIGHT * (56 / 1332), marginBottom: SCREEN_HEIGHT * (22 / 1332) }}><Text style={{ color: 'white', fontSize: SCREEN_HEIGHT * (30 / 1332) }}>Ok</Text></View>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.btn}>Disable ({this.state.isDisabled ? "true" : "false"})</TouchableOpacity> */}
        </Modal>

        {this.state.showCard === true && this.renderImage()}
        <LocksComponent isMoving={this.state.isMoving} position={this.position} lock={this.lock}
          unlock={this.unlock} />

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => this._toggleEventCreation()}>
            <Image style={styles.footerUpArrowImage}
              source={require('../assets/Icons/up_arrow/up_arrow.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._toggleEventCreation()}>
            <Image style={styles.footerImage}
              source={require('../assets/Icons/create_event_icon/create_event_icon.png')} />
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[{ position: "absolute", width: SCREEN_WIDTH, height: SCREEN_HEIGHT }, eventCreationStyle]}>
          <EventCreationComponent title='Edit event' buttonText='Update'
            close={this._toggleEventCreation} {...this.props}
            openModal={this.openModal}
          />
        </Animated.View>
        <View
          style={StyleSheet.absoluteFill}
          pointerEvents={this.state.activeProfile ? 'auto' : 'none'}
        >
          <View style={{ flex: 1, zIndex: 1001 }} ref={(view) => (this.viewProfile = view)}>
            {this.state.activeProfile &&
              <Animated.View style={[{ width: null, height: null, top: 0, left: 0, backgroundColor: '#fff', borderRadius: 5 }, activeProfileStyle]}>
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: -window.height / 6 }}>
                  <Animated.View style={[{ width: null, height: null, top: 0, left: 0, backgroundColor: 'red' }, activeImageStyle]}>
                    <Swiper horizontal={true} style={{ flex: 1 }} activeDotStyle={{ backgroundColor: 'yellow' }}>
                      <Image style={styles.images} source={require('../assets/Pngs/girlphoto.imageset/girlphoto.png')} />
                      <Image style={styles.images} source={require('../assets/Pngs/profilePhoto.imageset/profilePhoto.png')} />
                      <Image style={styles.images} source={require('../assets/Pngs/userbigphoto.imageset/userbigphoto.png')} />
                      <Image style={styles.images} source={require('../assets/Pngs/userbigphoto.imageset/userbigphoto.png')} />
                    </Swiper>
                    <TouchableOpacity style={{ width: window.height / 16, height: window.height / 16, position: 'absolute', top: window.height / 46, left: window.height / 46 }} onPress={() => this.closeImage()}>
                      <Image style={{ width: window.height / 16, height: window.height / 16 }} source={require('../assets/Icons/minimize.imageset/minimize.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: window.height / 16, height: window.height / 16, position: 'absolute', top: window.height / 46, right: window.height / 46 }} onPress={() => this.props.navigation.navigate('ChatRoom')}>
                      <Image style={{ width: window.height / 16, height: window.height / 16 }} source={require('../assets/Icons/chatting.imageset/chatting.png')} />
                    </TouchableOpacity>
                  </Animated.View>

                  <View style={styles.profInfoContainer}>
                    <View style={styles.nameAge}>
                      <View style={{ alignItems: 'flex-start', justifyContent: 'center', flex: 1 }}>
                        <Text style={{ fontFamily: 'Roboto', fontSize: window.height / 28, fontWeight: 'bold', margin: 10 }}>Scarlett, 31</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end', justifyContent: 'center', flex: 1 }}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <Text style={{ fontSize: window.height / 50 }}>Instagram</Text>
                          <Image source={require('../assets/Icons/instagram.imageset/instagram.png')} style={{ resizeMode: 'contain', width: window.height / 24, height: window.height / 24, margin: 10 }} />
                        </View>
                      </View>
                    </View>
                    <View style={styles.description}>
                      <Text style={{ marginLeft: 10, marginRight: 10, marginBottom: 10, fontSize: window.height / 50 }}>
                        Johasson began acting during childhood, after her mother started taking her to auditions.
                        She would audition for commercials but took rejection so hard that her mother began limiting her to film tryouts.
                          </Text>
                    </View>
                    <View style={styles.mutualFriends}>
                      <View style={{ flex: 0.75, justifyContent: 'center' }}>
                        <Text style={{ marginLeft: 10, marginRight: 10, fontSize: window.height / 45 }}>Mutual friends: </Text>
                      </View>
                      <View style={{ flex: 4 }} >
                        <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                          <FlatList
                            data={this.state.mutualFriendsData}
                            renderItem={this.displayMutualFriends}
                            keyExtractor={(item, index) => item.id.toString()}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </ScrollView>
                <View style={{ flexDirection: 'row', backgroundColor: 'transparent', height: window.height / 6, width: window.width, alignItems: 'center' }}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <TouchableOpacity onPress={this.guestLock}>
                      <Image source={require('../assets/Icons/lock1.imageset/lock1.png')} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <TouchableOpacity onPress={this.guestUnlock}>
                      <Image source={require('../assets/Icons/unlock1.imageset/unlock1.png')} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            }
          </View>
        </View>

      </ImageBackground>

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
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    height: SCREEN_HEIGHT * 0.09,
    marginTop: 20,
    paddingLeft: 10
  },
  menu1: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 0.67,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingLeft: 20,
  },
  menu2: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 0.33,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 30

  },
  cardContainer: {
    width: SCREEN_WIDTH * 0.8618,
    height: SCREEN_HEIGHT * 0.57432432,
    borderRadius: 5,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: SCREEN_HEIGHT / 2 - SCREEN_HEIGHT * 0.5217 / 2,
    backgroundColor: '#fff',
  },
  touchableCard: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'yellow',
  },
  footer: {
    width: SCREEN_WIDTH * 0.0761326,
    height: SCREEN_WIDTH * 0.116,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    // backgroundColor: 'aqua',
    marginTop: SCREEN_HEIGHT * 0.89914286
  },
  footerUpArrowImage: {
    width: SCREEN_WIDTH * 0.0761326
  },
  footerImage: {
    width: SCREEN_WIDTH * 0.058,
    height: SCREEN_WIDTH * 0.058
  },
  profileImage: {
    width: SCREEN_WIDTH * 0.8618 * 0.90415335,
    height: SCREEN_HEIGHT * 0.57432432 * 0.68529412,
  },



  profPicContainer: {
    width: window.width,
    height: window.height / 2 + window.height / 12,
  },
  profInfoContainer: {
    width: window.width,
    height: window.height / 2,
    flexDirection: 'column',
  },
  locks: {
    width: window.width,
    backgroundColor: 'red'
  },
  images: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  nameAge: {
    flex: 2,
    flexDirection: 'row',
  },
  description: {
    flex: 3.25,
  },
  mutualFriends: {
    flex: 9,
    flexDirection: 'column',
  },
  friends: {
    flexDirection: 'column',
    alignItems: 'center',
    height: window.height / 8,
    width: window.height / 9,
    justifyContent: 'flex-end',
    marginLeft: -5,
  },
  friendsImages: {
    height: window.height / 10.5,
    width: window.height / 10.5,
    borderRadius: 5
  },
  modal: {
    borderRadius: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: "center",
    height: SCREEN_HEIGHT * (313 / 1332),
    width: SCREEN_WIDTH * (559 / 748),
  },
});
