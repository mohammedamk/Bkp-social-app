import React from 'react';
import { createStackNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import LandingScreen from '../screens/LandingScreen';
import UserCalendarScreen from '../screens/UserCalendarScreen';
import EventDetailsScreen from '../screens/EventDetailScreen';
import UserSettingScreen from '../screens/UserSettingScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import GuestConfirmationScreen from '../screens/GuestConfirmationScreen';
import MapScreen from '../screens/MapScreen';
import GuestsListScreen from '../screens/GuestsListScreen';
import GuestsListEditScreen from '../screens/GuestsListEditScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GuestInfoConfirmationScreen from '../screens/GuestInfoConfirmationScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import DirectMessageScreen from '../screens/DirectMessageScreen'
import InviteFriends from '../screens/InviteFriends';
import MessagesScreen from '../screens/MessagesScreen';
import { fromLeft, fromRight } from 'react-navigation-transitions';

const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  const prevScene1 = scenes[scenes.length - 2];
  const nextScene1 = scenes[scenes.length - 1];
 
  // Custom transitions go there
  if (prevScene
    && prevScene.route.routeName === 'Landing'
    && nextScene.route.routeName === 'ProfileSetting') {
    return fromLeft();
  } else if (prevScene
    && prevScene.route.routeName === 'ProfileSetting'
    && nextScene.route.routeName === 'Landing') {
    return fromRight();
  }else if (prevScene1
    && prevScene1.route.routeName === 'Landing'
    && nextScene1.route.routeName === 'UserCalender') {
    return fromLeft();
  }else if (prevScene1
    && prevScene1.route.routeName === 'UserCalender'
    && nextScene1.route.routeName === 'Landing') {
    return fromRight();
  }
}

export default createStackNavigator({
    // Loading: props => <LoadingScreen
    //     borderColor={'#feea7e'}
    //     backgroundColor={'#feea7e'}
    //     size={50}
    //     {...this.props}
    //     pulseMaxSize={400}
    //     avatar={require('../assets/Icons/main_feed.imageset/main_feed.png')}/>,
    Login: LoginScreen,
    Landing: LandingScreen,
    UserCalender: UserCalendarScreen,
    EventDetails: EventDetailsScreen,
    ProfileSetting: UserSettingScreen,
    EditProfile: EditProfileScreen,
    Guest: GuestConfirmationScreen,
    Map: MapScreen,
    GuestsList: GuestsListScreen,
    GuestsListEdit: GuestsListEditScreen,
    Profile: ProfileScreen,
    GuestInfoConfirmation: GuestInfoConfirmationScreen,
    DirectMessage: DirectMessageScreen,
    Invite: InviteFriends,
    Messages: MessagesScreen,
    ChatRoom: ChatRoomScreen,
},{
    transitionConfig: (nav) => handleCustomTransition(nav)
})