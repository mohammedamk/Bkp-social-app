import React, { Component } from 'react';
import { Animated, Image, StyleSheet, View, TouchableHighlight } from 'react-native';
import Layout from "../constants/Layout";

const SCREEN_HEIGHT = Layout.window.height;
const SCREEN_WIDTH = Layout.window.width;

export default class LocksComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isMoving: props.isMoving,
      whichButtonClicked:'',
      position: props.position
    };

    this.unlockOpacity = this.state.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
    });

    this.lockOpacity = this.state.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
    });

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isMoving: nextProps.isMoving,
      position: nextProps.position
    });
  }

  lock = () => {
    this.setState({
      whichButtonClicked:''
    })
    this.props.lock()
  }

  unlock = () => {
    this.setState({
      whichButtonClicked:''
    })
    this.props.unlock()
  }

  _onShowUnderlay = (type) => {
    if (type === 'lock') {
      this.setState({
        whichButtonClicked: 'lock'
      })
    } else {
      this.setState({
        whichButtonClicked:'unlock'
      })
    }
  }

  render() {
    if (this.state.isMoving) {
      return (
        <View style={styles.chooseButton}>
          <Animated.View style={{
            opacity: this.lockOpacity,
            width: SCREEN_HEIGHT * 0.1,
            height: SCREEN_HEIGHT * 0.1
          }}>
            <Image style={styles.lockImage}
              source={require('../assets/Icons/lock_highlight.imageset/lock_highlight.png')} />
          </Animated.View>
          <Animated.View style={{
            opacity: this.unlockOpacity,
            width: SCREEN_HEIGHT * 0.1,
            height: SCREEN_HEIGHT * 0.1
          }}>
            <Image style={styles.lockImage}
              source={require('../assets/Icons/unlock_highlight.imageset/unlock_highlight.png')} />
          </Animated.View>
        </View>
      )
    } else {
      return (
        <View style={styles.chooseButton}>
          <Animated.View style={{
            width: SCREEN_HEIGHT * 0.1,
            height: SCREEN_HEIGHT * 0.1
          }}>
          <TouchableHighlight 
            activeOpacity={1}
            onPress={this.lock}
            onShowUnderlay={() => this._onShowUnderlay('lock')}
            underlayColor={'#ffffff00'}
          >
            <Image 
              style={styles.lockImage}
              source={this.state.whichButtonClicked === 'lock' ? require('../assets/Icons/lock_highlight.imageset/lock_highlight.png') : require('../assets/Icons/lock.imageset/lock.png')}
            />
          </TouchableHighlight>
          </Animated.View>
          <Animated.View style={{
            width: SCREEN_HEIGHT * 0.1,
            height: SCREEN_HEIGHT * 0.1
          }}>
          <TouchableHighlight 
            activeOpacity={1}
            onPress={this.unlock}
            onShowUnderlay={() => this._onShowUnderlay('unlock')}
            underlayColor={'#ffffff00'}
          >
            <Image 
              style={styles.lockImage}
              source={this.state.whichButtonClicked === 'unlock' ? require('../assets/Icons/unlock_highlight.imageset/unlock_highlight.png') : require('../assets/Icons/unlock.imageset/unlock.png')}
            />
          </TouchableHighlight>
          </Animated.View>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  chooseButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: SCREEN_HEIGHT * 0.0621118
  },
  lockImage: {
    width: '100%',
    height: '100%',
  },
});