import { SONGKICK_API_KEY, API_KEY, GOOGLE_API_KEY } from '../constants/ApiServices';
import * as ActionType from './index';
import { HEADERS } from '../constants/ApiServices';
import { Location } from 'expo';

export const locationSelected = (isIt) => (
    console.log("isIt", isIt),
    {
    type: 'LOCATION_SELECTED',
    payload: isIt,
});

export const confirmEvent = eventIndex => ({
    type: 'CONFIRM_EVENT',
    payload: eventIndex
});

export const declineEvent = eventIndex => ({
    type: 'DECLINE_EVENT',
    payload: eventIndex
});

export const createEvent = event => ({
    type: ActionType.CREATE_EVENT,
    payload: {
        client: 'rendevous',
        request: {
            method: 'POST',
            url: '/event',
            headers: HEADERS,
            data: {
                "owner_id": event.ownerid,
                "name": event.title,
                "detail": event.eventInfo,
                "start": event.startDatetime,
                "end": event.endDatetime,
                "location_name": event.location,
                "lat": event.coordinate.latitude,
                "long": event.coordinate.longitude
            }
        }
    }
});

export const addToSongkickEvents = events => ({
    type: 'SONGKICK_EVENT',
    payload: events
});

export const setNewAddress = location => ({
    type: 'SET_NEW_ADDRESS',
    payload: location,
});

export const giveUserLocation = (getUserAddress) => {
    console.log('using it')
    Location.getCurrentPositionAsync()
    return(dispatch) => {
        Location.getCurrentPositionAsync()
        .then(res => {
            console.log('response is',res);
            getUserAddress(res);
            dispatch({
                type:'GIVE_USER_LOCATION',
                payload: res,

            })
        })



    }
};



// export const setNewAddress = (location) => {
//     console.log('kafdlksajfalskdjfadoisjadsiofjsoi')
//     console.log(location.formatted_address)
//     return{
//         type: ActionType.SET_NEW_ADDRESS,
//         payload: location,
//     }

// }

export const getUserAddress = location => {
    console.log('gua ', location)
    return {
        type: ActionType.GET_USER_ADDRESS,
        payload: {
            client: 'googleMaps',
            request: {
                url: `/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${GOOGLE_API_KEY}`
            }
        }
    }
}

export const getSongkickEvents = (searchDistance) => {
    return {
        type: ActionType.GET_SONGKICK_EVENTS,
        payload: {
            client: 'songkick',
            request: {

                url: `/events.json?apikey=${SONGKICK_API_KEY}&location=geo:49.286590,-123.115830&page=1&per_page=10`
            }
        },
        distance: searchDistance,
    };
}

export const getEvents = (user_id = 205, latitude = 49.2834317, longitude = -123.11491930000001, search_distance = 10000) => {
    return {
        type: ActionType.GET_EVENTS,
        payload: {
            client: 'rendevous',
            request: {
                url: `/event?user_id=${user_id}&latitude=${latitude}&longitude=${longitude}&search_distance=${search_distance}`,
                headers: HEADERS
            }
        }
    };
}

