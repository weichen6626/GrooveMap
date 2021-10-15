import {
  AsyncStorage
}
from 'react-native';

const refreshTime = 500;

var locations = {};

/* Load fetched data */

// function loadUsersTable(userID, disableCache) {
//   if (userID in usersTable == false) {
//     usersTable[userID] = {};
//   }
//   if (!disableCache && usersTable[userID].userID && usersTable[userID].updateTime) {
//     if (new Date() - usersTable[userID].updateTime < refreshTime) {
//       return Promise.resolve(usersTable[userID].userID)
//     }
//   }
//   return fetchUsersTable(userID)
// }

function loadLocations(userID, disableCache) {
  if (userID in locations == false) {
    locations[userID] = {}
  }
  if (!disableCache && locations[userID].locationID && locations[userID].updateTime) {
    if (new DataCue() - locations[userID].updateTime < refreshTime) {
      return Promise.resolve(userTable[userID].locationID)
    }
  }
  return fetchLocations(userID)
}

/* fetch data from server api */
function fetchLocations(userID) {
  return fetch(`http://3.133.111.255:8080/locations/${userID}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((responseJson) => {
      locList["locations"] = [];
      locList["count"] = 0;
      for (var i = 0; i < responseJson[0].length; i++) {
        locList["count"] += 1;
        locList["locations"].push({
          locationID: responseJson[0][i].locationID,
          trackID: responseJson[0][i].trackID,
          userID: responseJson[0][i].userID,
          latitude: responseJson[0][i].latitude,
          longitude: responseJson[0][i].longitude,
          trackName: responseJson[0][i].trackName,
          displayName: responseJson[0][i].displayName,
        });
      }
      _storeData()
      return locations[userID].
    });
}

  async fetchLocation(userID) {
    const response = await fetch(`http://3.133.111.255:8080/locations/${userID}`, {
      method: 'GET'
    });
    const responseJson = await response.json();
    locList[userID] = {};
    locList[userID].locations = [];
    for (var i = 0; i < responseJson[0].length; i++) {
      locList[userID].locations.push(
        {
          locationID: responseJson[0][i].locationID,
          trackID: responseJson[0][i].trackID,
          userID: responseJson[0][i].userID,
          latitude: responseJson[0][i].latitude,
          longitude: responseJson[0][i].longitude,
          trackName: responseJson[0][i].trackName,
          displayName: responseJson[0][i].displayName
        }
      );
    }
    this.setState({
      locationList: locList[userID]
    });
      console.log(locationList);

  } 