import {combineReducers} from 'redux';
import {eventsReducer} from "./EventsReducer";
import {userReducer} from "./UserReducer";

// here combineReducers is use to split the main reducer into smaller ones
export const reducer = combineReducers({
    // this one is a special reducer to sync the router with the redux store
    events: eventsReducer,
    user: userReducer
});
