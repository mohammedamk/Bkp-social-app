import React, {Component} from 'react';
import {
    Animated,
    Easing,
    Image,
    ImageBackground,
    PanResponder,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import EventComponent from "../components/EventComponent";
import LocksComponent from "../components/LocksComponent";
import Layout from "../constants/Layout";
import EventCreationComponent from '../components/EventCreationComponent.js';
import Modal from 'react-native-modalbox';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addToSongkickEvents, confirmEvent, getSongkickEvents, declineEvent, getEvents, giveUserLocation, getUserAddress } from "../actions/eventsActions";
import PulseLoader from '../constants/PulseLoader/PulseLoader';

const SCREEN_HEIGHT = Layout.window.height;
const SCREEN_WIDTH = Layout.window.width;

class LandingScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.eventCreationTop = new Animated.Value(1);
    this.arrowTop = new Animated.Value(0);
    this.arrowFlip = new Animated.Value(0);
    this.imageXPos = new Animated.Value(0);
    this.position = new Animated.ValueXY();
    this.pan = new Animated.ValueXY();
    this.cardAnimation = null;
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
      modalText: 'yikes',
      showCard: true,
      imageIndex: 0,
      isMoving: false,
      eventCreationHidden: true,
      arrowFlipped: false,
      arrowIsTop: false,
      isDisabled: false,
      songKickEvents: [],
      fetching: false
    }
  }


  componentWillMount() {
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
        // console.log('RELEASED', gs);
        this.setState({ isMoving: false })
        if (gs.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 200, y: gs.dy }
          }).start(() => {
            this.props.confirmEvent(this.state.imageIndex);
            this.setState({
              imageIndex: this.state.imageIndex + 1
            }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        } else if (gs.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 200, y: gs.dy }
          }).start(() => {
            this.props.declineEvent(this.state.imageIndex);
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

  componentDidMount() {
    this.props.giveUserLocation(this.props.getUserAddress);
    this.props.getSongkickEvents();
    this.props.getEvents();
  }

  _toggleEventCreation = () => {
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
    const theValue2 = this.state.arrowIsTop ? 0 : 1;
    const theValue3 = this.state.arrowFlipped ? 0 : 1;

    Animated.parallel([
      Animated.timing(this.eventCreationTop, {
        toValue: theValue,
        duration: 500,
        easing: Easing.ease,
      })
    ]).start()
  };

  lock = () => {
    console.log('lock!')
    Animated.spring(this.position, {
      toValue: { x: -SCREEN_WIDTH - 160, y: SCREEN_HEIGHT / 6 },
      friction: 500,
      tension: 1,
    }).start(() => {
      this.props.declineEvent(this.state.imageIndex);
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
      toValue: 480,
      friction: 500,
      tension: 1,
    }).start(() => {
      this.props.confirmEvent(this.state.imageIndex);
      this.setState({
        imageIndex: this.state.imageIndex + 1
      }, () => {
        this.position.setValue({ x: 0, y: 0 })
      })
    })
  }


  openModal = (text = "Please fill out the required fields.") => {

    console.log('modal text: ' + text);
    this.setState({modalText: text}, () => this.refs.modal3.open());
  }

  renderImage = () => {
    return this.props.availableEvents.map((item, i) => {
      let isSongkick = 'performance' in item;
      // let actualItem = isSongkick ? item : item['event'];
      if (i < this.state.imageIndex) {
        return null
      } else if (i === this.state.imageIndex) {
        return (
          <Animated.View
            {...this.imagePanResponder.panHandlers}
            key={i}
            style={[this.rotateAndTranslate, styles.cardContainer]}
          >
            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('EventDetails', {
              event: item,
              eventConfirmed: false,
              isSongkick: isSongkick
            })}>
              <View style={{ width: '100%', height: '100%' }}>
                <EventComponent event={item} eventConfirmed={false} isSongkick={isSongkick} />
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        )
      } else {
        return (
          <Animated.View
            key={i}
            style={styles.cardContainer}>
            <View style={{ width: '100%', height: '100%' }}>
                <EventComponent event={item} eventConfirmed={false} isSongkick={isSongkick} />
            </View>
          </Animated.View>
        )
      }
    }).reverse();
  };

  render() {
    const interpolateRotation = this.arrowFlip.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    const arrowInterpolateTop = this.arrowTop.interpolate({
      inputRange: [0, 1],
      outputRange: [SCREEN_HEIGHT * 0.0931458699472, SCREEN_HEIGHT * 0.8345070422535]
      // outputRange: [SCREEN_HEIGHT * (0.175465838509317 + 0.036), SCREEN_HEIGHT * (0.830745341614907 - 0.036)]
    });

    const arrowStyle = {
      bottom: arrowInterpolateTop,
      transform: [
        { rotate: interpolateRotation }
      ]
    };

    const eventCreationInterpolate = this.eventCreationTop.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"]
    });

    const eventCreationStyle = {
      top: eventCreationInterpolate,
    };

    return (
      this.props.loading ? 
        <PulseLoader
          borderColor={'#feea7e'}
          backgroundColor={'#feea7e'}
          size={50}
          pulseMaxSize={400}
          avatar={require('../assets/Icons/main_feed.imageset/main_feed.png')}
        />
        :
        <ImageBackground style={styles.background} source={require('../assets/Pngs/bg.imageset/bg.png')}>
          <Animated.View style={[arrowStyle, {
            zIndex: 100,
            position: "absolute",
            backgroundColor: "transparent"
          }, styles.arrowView]}>
            <TouchableHighlight onPress={
              () => this._toggleEventCreation()
            }
              style={{ flex: 1, backgroundColor: 'transparent' }}>
              <Image style={styles.arrow} source={require('../assets/Icons/up_arrow/up_arrow.png')} />
            </TouchableHighlight>
          </Animated.View>

          {this.state.showCard && 
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ProfileSetting')}>
              <View style={styles.menu1}>
                <Image source={require('../assets/Icons/setting_yellow/settings.png')} />
              </View>
            </TouchableOpacity>
            <View style={styles.menu2}>
              <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                source={require('../assets/images/logo.png')} />
            </View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('UserCalender')}>
              <View style={styles.menu3}>
                <Image source={require('../assets/Icons/event_yellow/calendar.png')} />
              </View>
            </TouchableOpacity>
          </View>}

          <Modal onBackdropPress={() => console.log('Modal')} style={styles.modal} position={"center"}
            ref={"modal3"} isDisabled={this.state.isDisabled}>
            <View style={{
              flexDirection: "row",
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#5bb983',
              width: "100%",
              height: SCREEN_HEIGHT * (73 / 1332),
              borderTopRightRadius: 5,
              borderTopLeftRadius: 5
            }}><Text style={{ color: 'white', fontSize: SCREEN_HEIGHT * (30 / 1332) }}>Warning</Text></View>
            <Text style={{ fontSize: SCREEN_HEIGHT * (30 / 1332) }}>{this.state.modalText}</Text>
            <TouchableOpacity onPress={() => this.refs.modal3.close()}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                backgroundColor: '#fdd302',
                width: SCREEN_WIDTH * (502 / 748),
                height: SCREEN_HEIGHT * (56 / 1332),
                marginBottom: SCREEN_HEIGHT * (22 / 1332)
              }}><Text style={{ color: 'white', fontSize: SCREEN_HEIGHT * (30 / 1332) }}>Ok</Text></View>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.btn}>Disable ({this.state.isDisabled ? "true" : "false"})</TouchableOpacity> */}
          </Modal>

          {this.state.showCard === true && this.renderImage()}
          {this.state.showCard === true &&
            <LocksComponent isMoving={this.state.isMoving} position={this.position} lock={this.lock}
              unlock={this.unlock} />}

          <TouchableOpacity style={styles.footer} onPress={() => this._toggleEventCreation()}>
            <Image style={styles.footerImage}
              source={require('../assets/Icons/create_event_icon/create_event_icon.png')} />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.btn}>Disable ({this.state.isDisabled ? "true" : "false"})</TouchableOpacity> */}

        {this.state.showCard === true && this.renderImage()}

        <TouchableOpacity style={styles.footer} onPress={() => this._toggleEventCreation()}>
          <Image style={styles.footerImage}
            source={require('../assets/Icons/create_event_icon/create_event_icon.png')} />
        </TouchableOpacity>

        <Animated.View
          style={[{ position: "absolute", width: SCREEN_WIDTH, height: SCREEN_HEIGHT }, eventCreationStyle]}>
          <EventCreationComponent title='Create new event ' buttonText='Post'
            close={this._toggleEventCreation}
            openModal={this.openModal}
            {...this.props} />
        </Animated.View>

        </ImageBackground>

    )
  }
}

const styles = StyleSheet.create({
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
    // backgroundColor:'red'
  },
  menu1: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    width: 24,
    // backgroundColor:'green',
    marginLeft: 15
  },
  menu2: {
    flexDirection: 'row',
    alignItems: 'center',
    // width:20,
    // height:15,
    width: SCREEN_WIDTH * 0.4,
    height: '100%',
    // backgroundColor:'yellow'
  },
  menu3: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    width: 24,
    // backgroundColor:'aqua',
    marginRight: 15
  },
  cardContainer: {
    width: SCREEN_WIDTH * 0.8722,
    height: SCREEN_HEIGHT * 0.6234375,
    borderRadius: 50,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: SCREEN_HEIGHT / 2 - SCREEN_HEIGHT * 0.5217 / 2,
  },
  footer: {
    // width: SCREEN_WIDTH * 0.0761326,
    // height: SCREEN_WIDTH * 0.116,
    height: SCREEN_HEIGHT * 0.0369718309859,
    width: SCREEN_WIDTH * (21 / 360),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: SCREEN_HEIGHT * (25 / 592),
  },
  footerUpArrowImage: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.0761326,
    // top: SCREEN_HEIGHT - 109.857142857,
    zIndex: 99,

  },

  footerImage: {
    // width: SCREEN_WIDTH * 0.058,
    // height: SCREEN_WIDTH * 0.058
    width: "100%",
    height: "100%",
    resizeMode: 'contain',
  },

  arrowView: {
    width: SCREEN_WIDTH * 0.06801105,
    height: SCREEN_HEIGHT * 0.00908178,
    backgroundColor: 'transparent',
    zIndex: 99,
  },

  arrow: {
    width: "100%",
    height: "100%",
    zIndex: 100,
    resizeMode: 'contain',
  },

  modal: {
    borderRadius: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: "center",
    height: SCREEN_HEIGHT * (313 / 1332),
    width: SCREEN_WIDTH * (559 / 748),
    zIndex: 105,
  },

});

const mapStateToProps = (state) => {
  let { events } = state;
  let songKickEvents = events.songKickEvents
  let loading = events.loading
  let availableEvents = events.availableEvents
  let userLocation = state.user.userLocation;
  let userAddress = state.user.userAddress;
  return {
    events,
    songKickEvents,
    loading,
    availableEvents,
    userLocation,
    userAddress,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getUserAddress,
    confirmEvent,
    addToSongkickEvents,
    getSongkickEvents,
    declineEvent,
    getEvents,
    giveUserLocation,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(LandingScreen);