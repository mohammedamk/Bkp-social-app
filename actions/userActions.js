import { API_KEY } from '../constants/ApiServices';
import * as ActionType from './index';
import {HEADERS} from "../constants/ApiServices";

export const saveSearchDistance = settings => ({
    type: 'SAVE_SEARCH_DISTANCE',
    payload: settings
});

export const saveProfileDetails = details => ({
    type: 'SAVE_PROFILE_DETAILS',
    payload: details
});

export const addProfilePhoto = photoURI => ({
	type: 'ADD_PROFILE_PHOTO',
	payload: photoURI,
});

export const saveUserLogin = login => ({
    type: ActionType.LOGIN_USER,
    payload: {
        client: 'rendevous',
        request: {
            method: 'POST',
            url: '/user/signin/facebook',
            headers: {
                'Content-Type': 'application/json',
                'api-key': API_KEY,
                'sessiontoken': login.sessiontoken
            },
            data: {
                "user_email": login.email,
                "user_type": "1",
                "user_fb_id": login.fbId,
                "user_fb_token": login.fbToken,
                "user_first_name": login.first,
                "user_last_name": login.last,
                "friend_ids": "1",
                "user_friend_names": ["temp"],
            }
        }
    }
});

export const loadUserInfoFromLocal = info => ({
    type: 'LOAD_USER_INFO',
    payload: info
})

export const loadUserInfoFromApi = info => ({
    type: ActionType.LOAD_USER_INFO,
    payload: {
        client: 'rendevous',
        request: {
            method: 'GET',
            url: `/user/1`,
            headers: {
                'Content-Type': 'application/json',
                'api-key': API_KEY,
                'sessiontoken': info.sessiontoken
            }
        }
    }
})

export const logoutUser = () => ({
    type: 'LOGOUT_USER'
})

export const getUserBookings = userId => ({
    type: ActionType.GET_USER_BOOKINGS,
    payload: {
        client: 'rendevous',
        request: {
            url: `/user/${userId}/bookings`,
            headers: HEADERS
        }
    }
});
