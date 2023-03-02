import * as ActionType from '../actions';
import {FAILURE, REQUEST, SUCCESS} from '../constants/Action-Type';
import geolib from 'geolib';

const eventStates = {
    availableEvents: [],
    confirmedEvents: [],
    declinedEvents: [],
    loading: false,
    error: null,
};

export const eventsReducer = (state = eventStates, action) => {
    function _filterEvents (newEvents, searchDistance) {
        let eventCoord;
        let currentCoord = {    // replace with user position
            latitude: 49.286590,
            longitude: -123.115830
        };
        for (let i = newEvents.length - 1; i >= 0; i--) {
            if (state.availableEvents.filter(e => e.id === newEvents[i].id).length > 0 ||
                state.confirmedEvents.filter(e => e.id === newEvents[i].id).length > 0 ||
                state.declinedEvents.filter(e => e.id === newEvents[i].id).length > 0)
                newEvents.splice(i, 1);
            else {
                if ('venue' in newEvents[i]) {
                    eventCoord = {
                        latitude: newEvents[i].venue.lat,
                        longitude: newEvents[i].venue.lng
                    };
                }
                else {
                    eventCoord = {
                        latitude: newEvents[i].lat,
                        longitude: newEvents[i].long
                    };
                }
                if (geolib.getDistance(currentCoord, eventCoord) / 1000 > searchDistance)
                    newEvents.splice(i, 1);
            }
        }
        return newEvents;
    }

    switch (action.type) {
        case REQUEST(ActionType.GET_SONGKICK_EVENTS):
        case REQUEST(ActionType.GET_EVENTS):
        case REQUEST(ActionType.CREATE_EVENT):
            return {
                ...state,
                loading: true
            }
        case SUCCESS(ActionType.GET_SONGKICK_EVENTS):
            let newSongkickEvents = _filterEvents(action.payload.data.resultsPage.results.event, action.meta.previousAction.distance);
            return {
                ...state,
                availableEvents: [...state.availableEvents, ...newSongkickEvents],
                loading: false
            };
        case SUCCESS(ActionType.GET_EVENTS):
            if (action.payload.data.events != undefined) {
                let newEvents = _filterEvents(action.payload.data.events, action.meta.previousAction.distance);
                return {
                    ...state,
                    availableEvents: [...state.availableEvents, ...newEvents],
                    loading: false
                };
            }
            return {
                ...state,
                availableEvents: [...state.availableEvents],
                loading: false
            };
        case SUCCESS(ActionType.CREATE_EVENT):
            let newEvent = action.payload.data.params;
            newEvent['isCurrentUserHost'] = true;
            return {
                ...state,
                confirmedEvents: [...state.confirmedEvents, newEvent]
            };

        case FAILURE(ActionType.CREATE_EVENT):
            console.log(action.payload);
            return {
                ...state
            };
        case FAILURE(ActionType.GET_SONGKICK_EVENTS):
            return {
                ...state,
                loading: false,
                error: 'Error while fetching songkick events'
            }
        case 'CONFIRM_EVENT':
            return {
                ...state,
                confirmedEvents: [...state.confirmedEvents, state.availableEvents[action.payload]]
            }
        case 'DECLINE_EVENT':
            return {
                ...state,
                declinedEvents: [...state.declinedEvents, state.availableEvents[action.payload]]
            }
        default:
            return state
    }
};