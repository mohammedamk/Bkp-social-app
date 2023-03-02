import React, { Component } from 'react';
import { Dimensions, Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import { Constants, Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUserAddress, setNewAddress, giveUserLocation } from "../actions/eventsActions";

import Layout from "../constants/Layout";

const apiKey = 'AIzaSyCdkuIQGc6zBWg22z3i7EalpRQL_79RLjU';

const SCREEN_HEIGHT = Layout.window.height;
const SCREEN_WIDTH = Layout.window.width;

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;


class MapScreen extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor() {
    // console.log(LATITUDE_DELTA);
    super();
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      coordinate: {
        latitude: 0,
        longitude: 0,
      },
      locationPermission: 'unknown',
      position: 'unknown',
      set: true,
      location: null,
      errorMessage: null,
    };


  }


  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.log("not")
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.props.giveUserLocation(this.props.getUserAddress)

    this.setState({
      region: {
        latitude: location,
        longitude: this.props.userLocation.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      coordinate: {
        latitude: this.props.userLocation.coords.latitude,
        longitude: this.props.userLocation.coords.longitude,
      },
    }, () => {console.log(this.state.coordinate)});
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }


  _onPress = (data, details) => {
    const position = {
      latitude: details.geometry.location.lat,
      latitudeDelta: 0.1,
      longitude: details.geometry.location.lng,
      longitudeDelta: 0.1,
    }
    // console.log(details);
    this.props.setNewAddress(details);
    // console.log(this.props.title);
    // console.log(details.formatted_address);
    // console.log(this.props.title);
    this.setState({
      region: position,
      data: data,
      details: details,
      coordinate: {
        latitude: position.latitude,
        longitude: position.longitude,
      }

    });
  }

  async _requestPermission() {
    const { Location, Permissions } = Expo;
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      return Location.getCurrentPositionAsync();
    } else {
      throw new Error('Location permission not granted');
    }
  }

  handleOnPress = () => {
    this.props.navigation.state.params.returnData(this.state.data, this.props.title);
    this.props.navigation.goBack();
  }


  render() {
    return (
      <ImageBackground style={{ ...StyleSheet.absoluteFillObject, zIndex: -6 }} source={require('../assets/Pngs/bg.imageset/bg.png')}>
        <StatusBar />
        <View style={styles.container}>
          
          <View style={{ justifyContent: 'center', alignItems: 'center', bottom: SCREEN_HEIGHT * (16 / 592), right: SCREEN_WIDTH * (16 / 360), width: SCREEN_WIDTH * (57 / 360), height: SCREEN_WIDTH * (57 / 360), position: 'absolute', zIndex: 99 }}>
            <TouchableOpacity onPress={() => this._getLocationAsync()}>
              <Image resizeMode='contain' style={{ flex: 1 }} source={require('../assets/Icons/get-current-location-icon/current-location.png')} />
            </TouchableOpacity>
          </View>

          <View style={styles.mapContainer}>
            <MapView
              region={this.state.region}
              style={styles.map}
              provider="google"
            // customMapStyle={gMapsStyle}
            >
              <Marker
                coordinate={this.state.coordinate}
                title={this.props.userState.address}
                image={require('../assets/Icons/get-current-location-icon/location-marker.png')}
                draggable
              />


            </MapView>
          </View>
          <GooglePlacesAutocomplete
            placeholder='Search'
            minLength={0} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed={false}   // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            // onChangeText={}
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              // this.setState({});
              this._onPress(data, details)
            }}
            // onEndEditing={}

            getDefaultValue={() => ''}

            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: apiKey,
              language: 'en', // language of the results
              // location: `${this.state.region.latitude},${this.state.region.longitude}`,
              radius: 1000,
              // default: 'geocode'
            }}

            styles={{
              container: {
                zIndex: 5,

              },
              textInputContainer: {
                width: '100%',
                zIndex: 5,
                backgroundColor: 'transparent',
                borderWidth: 0,

              },
              description: {
                fontWeight: 'bold',
                zIndex: 5,

              },
              predefinedPlacesDescription: {
                color: '#1faadb',
                zIndex: 5,
              },

              listView: {
                zIndex: 5,
                opacity: 1,
              },

              textInput: {
                borderRadius: 50,

              },

              loader: {

              },

              powered: {
                opacity: 0
              },

              poweredContainer: {
                opacity: 0,
              },

              separator: {

              },

              row: {
                backgroundColor: 'white',

              }



            }}

            // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            // currentLocationLabel="Current location"
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'distance',
            }}
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
            renderLeftButton={() =>
              <View style={{ justifyContent: 'center', alignItems: 'center', width: SCREEN_WIDTH * (40 / 360), height: SCREEN_WIDTH * (40 / 360) }}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                  <Image resizeMode='contain' style={{ marginLeft: SCREEN_WIDTH * (10 / 360), marginVertical: SCREEN_HEIGHT * (10 / 592), flex: 1 }} source={require('../assets/Icons/go-back-left-arrow/go-back-left-arrow.png')} />
                </TouchableOpacity>
              </View>
            }

            renderRightButton={() =>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.handleOnPress()}>
                  <Text style={{ color: '#fdd301', fontSize: SCREEN_HEIGHT * (12 / 592), marginRight: SCREEN_WIDTH * (10 / 360) }}>Select</Text>
                </TouchableOpacity>
              </View>
            }

          />
        </View>
      </ImageBackground>

    )
  }
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    flexDirection: 'column-reverse',
  },

  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    marginTop: "10%",
    marginBottom: 0,

  },

  map: {
    zIndex: 1,
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
  },
});

const mapStateToProps = (state) => {
  let userState = state.user;
  let title = state.user.address;
  let userLocation = state.user.userLocation;
  let userAddress = state.user.address
  return {
    userState,
    title,
    userLocation,
    userAddress,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getUserAddress,
    setNewAddress,
    giveUserLocation,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);

var gMapsStyle = [
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#7c93a3"
      },
      {
        "lightness": "-10"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c2d1d6"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#dde3e3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#c2d1d6"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#a9b4b8"
      },
      {
        "lightness": "0"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a3c7df"
      }
    ]
  }
]
