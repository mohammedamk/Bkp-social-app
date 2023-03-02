import axios from 'axios';

export const client = {
  rendevous: {
    client: axios.create({
      baseURL: 'http://ec2-34-211-183-21.us-west-2.compute.amazonaws.com',
      responseType: 'json'
    })
  },
  songkick: {
    client: axios.create({
      baseURL: 'http://api.songkick.com/api/3.0',
      responseType: 'json'
    })
  },
  googleMaps: {
    client: axios.create({
      baseURL: 'https://maps.googleapis.com/maps/api/geocode',
      responseType: 'json'
    })

  }
}

// Api-key and Token
export const API_KEY = 'j05wd2ae49d212578ef13cb607cef64b';
export const SESSION_TOKEN = '7GJZh/PzWvDabpAIqw5qnKY/dvjc/3Xe';
//export const SESSION_TOKEN = 'Kw/xlaGwyV/6mmf6CF2oxo9Y4eqokxzO';
export const SONGKICK_API_KEY = 'mzzfkojpy82tOJLz';
export const GOOGLE_API_KEY = 'AIzaSyCdkuIQGc6zBWg22z3i7EalpRQL_79RLjU';

// Header
export const HEADERS = {
  'Content-Type': 'application/json',
  'api-key': 'j05wd2ae49d212578ef13cb607cef64b',
  'sessiontoken': '7GJZh/PzWvDabpAIqw5qnKY/dvjc/3Xe'
  //'sessiontoken': 'Kw/xlaGwyV/6mmf6CF2oxo9Y4eqokxzO'
}

// // Api Calls
// export function createEvent(event) {
//   console.debug(`POST ${CREATE_EVENT_URL}`);
//   return fetch(CREATE_EVENT_URL + `?owner_id=${event.owner_id}&name=${event.name}&detail=${event.detail}&start=${event.start}&end=${event.end}&location_name=${event.location_name}&lat=${event.lat}&long=${event.long}`, {
//     method: 'POST',
//     headers: HEADER
//   });
// }


