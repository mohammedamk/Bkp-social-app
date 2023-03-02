import { AsyncStorage } from 'react-native';
import { FAILURE, REQUEST, SUCCESS } from '../constants/Action-Type';
import * as ActionType from '../actions';
import { CompositeDisposable } from 'rx';
import {bookings, myEvents} from "../constants/dummyData";


const userStates = {
    currentUser: {
        first: 'Zac',
        last: null,
        about: 'Nam dapibus nisl vitae elit fringilla rutrum.\nAenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisle nunc et massa.',
        contact: 'Contact Info',
        //photo1_url: require('../assets/Pngs/profilePhoto.imageset/profilePhoto.png'),
        photo1_url: null,
        //photo2_url: require('../assets/Pngs/placeholder-user-photo.imageset/placeholder-user-photo-1.png'),
        photo2_url: null,
        //photo3_url: require('../assets/Pngs/placeholder-user-photo.imageset/placeholder-user-photo-1.png'),
        photo3_url: null,
        //photo4_url: require('../assets/Pngs/placeholder-user-photo.imageset/placeholder-user-photo-1.png'),
        photo4_url: null,
        friend_ids: null,
        user_id: null,
        search_distance_km: 40,
        email: null,
        fbToken: null,
    },
    userBookings: bookings,
    myEvents: myEvents,
    address: null,
    userLocation: null,
    userHasPicked: false,

};

export const userReducer = (state = userStates, action) => {

    const { currentUser, userBookings} = state;
    address = null;

    switch (action.type) {
        case 'GIVE_USER_LOCATION':
        let userLocation = action.payload;
        let address =
        console.log('location is ',userLocation);
        return{
            ...state,
            userLocation
        }

    case 'SET_NEW_ADDRESS':
        // console.log(action.payload);
        // let responseJson = action.payload.data;
        address = action.payload.formatted_address;
        // console.log(address);
        return {
            ...state,
            address,
        }
    case REQUEST(ActionType.GET_USER_ADDRESS):
        return {
            ...state
        }
    case SUCCESS(ActionType.GET_USER_ADDRESS):
        let responseJson = action.payload.data;
        address = responseJson.results[0].formatted_address;
        return {
            ...state,
            address
        }
    case FAILURE(ActionType.GET_USER_ADDRESS):
        return {
            ...state,
            error: 'Could not get location'
        }

        case 'SAVE_SEARCH_DISTANCE':
            const distance = action.payload;
            // console.log(distance);
            let user = currentUser;
            user.search_distance_km = distance;

            return state;

        case 'SAVE_PROFILE_DETAILS':
            const profileDetails = action.payload;
            let profile = currentUser;
            profile.about = profileDetails.profileBioText;
            profile.contact = profileDetails.contactInfoText;
            profile.photo1_url = profileDetails.imageSource[0];
            profile.photo2_url = profileDetails.imageSource[1];
            profile.photo3_url = profileDetails.imageSource[2];
            profile.photo4_url = profileDetails.imageSource[3];

            return state;

        case 'ADD_PROFILE_PHOTO':
            const photoURI = action.payload;
            let profilePhotos = currentUser;

            if (profilePhotos.photo1_url === null)
                profilePhotos.photo1_url = photoURI;
            else {
                if (profilePhotos.photo2_url === null)
                    profilePhotos.photo2_url = photoURI;
                else {
                    if (profilePhotos.photo3_url === null)
                        profilePhotos.photo3_url = photoURI;
                    else {
                        profilePhotos.photo4_url = photoURI;
                    }
                }
            }

            return state;

        // Register/Refresh on Rendevous API the user details on login
        case REQUEST(ActionType.LOGIN_USER):
            return state

        case SUCCESS(ActionType.LOGIN_USER):
            // console.log('SUCCESS');
            // // console.log(action.payload);
            // console.log('RETURN DATA');
            // console.log(action.payload.data);
            // console.log('PUSHED DATA');
            // console.log(action.payload.config.reduxSourceAction.payload.request.data);
            let loginData1 = action.payload.data;
            //alert(JSON.stringify(loginData2))
            let loginData2 = action.payload.config.reduxSourceAction.payload.request.data;
            currentUser.fbToken = loginData2.user_fb_token;
            currentUser.first = loginData2.user_first_name;
            currentUser.last = loginData2.user_last_name;
            currentUser.email = loginData2.user_email;
            currentUser.photo1_url = loginData1.fbPic;
            currentUser.fbId = loginData2.user_fb_id;
            currentUser.user_id = loginData1.user_id;
            currentUser.sessiontoken = loginData1.session_token;
            currentUser.isNewUser = loginData1.is_new;
            currentUser.isLoggedIn = true;

            return state

        case FAILURE(ActionType.LOGIN_USER):
            console.log('FAILURE');
            console.log(action.payload);
            return state

        // Load saved user info from AsyncStorage
        case 'LOAD_USER_INFO':
            let userInfo = action.payload;
            currentUser.fbToken = userInfo.fbToken;
            currentUser.fbId = userInfo.fbId;
            currentUser.sessiontoken = userInfo.sessiontoken;
            currentUser.fbPic = userInfo.fbPic;
            return state

        // Load saved user info from API
        case REQUEST(ActionType.LOAD_USER_INFO):
            return state

        case SUCCESS(ActionType.LOAD_USER_INFO):
            let loadData = action.payload.data.current_user;
            currentUser.first = loadData.first;
            currentUser.last = loadData.last;
            currentUser.email = loadData.email;
            // currentUser.photo1_url = data.fbPic;
            currentUser.user_id = loadData.user_id;
            currentUser.about = loadData.about;
            currentUser.contact = loadData.contact;
            currentUser.photo1_url = loadData.photo1_url;
            currentUser.photo2_url = loadData.photo2_url;
            currentUser.photo3_url = loadData.photo3_url;
            currentUser.photo4_url = loadData.photo4_url;
            currentUser.search_distance_km = loadData.search_distance_km;
            currentUser.isNewUser = false;
            currentUser.isLoggedIn = true;
            return state

        case FAILURE(ActionType.LOAD_USER_INFO):
            console.log('FAILURE');
            console.log(action.payload);
            return state

        // fetch to fb and remove permission, then clear token in asyncstorage
        // and clear state with null
        // Used: UserSettingScreen.js
        case 'LOGOUT_USER':
            const _logout = async () => {
                let lParams = `access_token=${currentUser.fbToken}`;
                await fetch(`https://graph.facebook.com/${currentUser.fbId}/permissions`, { method: 'DELETE', body: lParams });
                console.log('LOGGING OUT...');
                await AsyncStorage.removeItem('userInfo');
            }
            _logout();
            currentUser.isLoggedIn = false;
            currentUser.fbToken = null;
            currentUser.first = null;
            currentUser.last = null;
            currentUser.email = null;
            currentUser.photo1_url = null;
            currentUser.user_id = null;
            currentUser.fbId = null;
            currentUser.sessiontoken = null;
            currentUser.isNewUser = null;

            return state;
        // case REQUEST(ActionType.GET_USER_BOOKINGS):
        // case SUCCESS(ActionType.GET_USER_BOOKINGS):
        //     let bookings = action.payload.data ? action.payload.data.bookings : [];
        //     return {
        //         ... state,
        //         userBookings: [...userBookings, bookings]
        //     };

        default:
            return state
    }
};
