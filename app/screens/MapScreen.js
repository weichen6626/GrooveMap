import React from "react";
import MapView, {
  Callout,
  Marker,
  CalloutSubview,
  AnimatedRegion,
} from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  Button,
  Linking,
  Image
} from "react-native";
import { render } from "react-dom";

/* How to auto zoom into your current location using React Native Maps - by Arvind Chakraborty
 * https://medium.com/@arvind.chak128/how-to-auto-zoom-into-your-current-location-using-react-native-maps-88f9b3063fe7
 **/

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: this.props.userID,
      trackToAdd: this.props.trackToAdd,
      locationList: [],
      initialRegion: {
        latitude: 40.101523, // UIUC location
        longitude: -88.227074,
        latitudeDelta: 0.0221,
        longitudeDelta: 0.0222,
      },
      followingList: []
    };
    this.updateLocation = this.updateLocation.bind(this);
    this.addLocation = this.addLocation.bind(this);
    this.deleteLocation = this.deleteLocation.bind(this);
    this.fetchFollowing();
  }

  async fetchFollowing() {
    try {
      const response = await fetch(
        `http://3.133.111.255:8080/getfollowing/${this.state.userID}`,
        {
          method: "GET",
        }
      );
      const responseJson = await response.json();
      var tempList = [];
      for (var i = 0; i < responseJson.length; i++) {
        tempList.push(responseJson[i]["followedID"]);
      }
      this.setState({
        followingList: tempList,
      });

      this.fetchLocation();
    } catch (error) {
      console.log(error);
    }
  }

  createTwoButtonAlert = (loc) =>
    Alert.alert(
      "Select Action",
      "Select an action on the location.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Delete Location", onPress: () => this.deleteLocation(loc.locationID) },
        {
          text: "Play on Spotify",
          onPress: () => Linking.openURL(`spotify:track:${loc.trackID}`),
        },
        {
          text: "Create Playlist",
          onPress: () => this.addRecPin(loc, 1),
        },
      ],
      { cancelable: false }
    );

  // componentDidMount() {
  //   this.getCurrentLocation();
  // }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let region = {
          latitude: parseFloat(position.coords.latitude),
          longitude: parseFloat(position.coords.longitude),
          latitudeDelta: 0.0222,
          longitudeDelta: 0.0221,
        };
        this.setState({
          mapRegion: region,
        });
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      }
    );
  }

  goToInitialLocation() {
    let initialRegion = Object.assign({}, this.state.initialRegion);
    initialRegion["latitudeDelta"] = 0.0222;
    initialRegion["longitudeDelta"] = 0.0221;
    this.mapView.animateToRegion(initialRegion, 2000);
  }

  updateLocation(coordinate, locationID) {
    for (var i = 0; i < this.state.locationList.length; i++) {
      if (this.state.locationList[i].locationID == locationID) {
        this.state.locationList[i].latitude = coordinate.latitude;
        this.state.locationList[i].longitude = coordinate.longitude;
        fetch(`http://3.133.111.255:8080/updatelocation/`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            locationID: locationID,
            trackID: this.state.locationList[i].trackID,
            userID: this.state.userID,
            latitude: this.state.locationList[i].latitude,
            longitude: this.state.locationList[i].longitude,
          }),
        }).catch((error) => {
          console.log(error);
        });
      }
    }
    console.log(locationID + " updated");
  }

  async fetchLocation() {
    var tempList = [];
    for (var j = 0; j <= this.state.followingList.length; j++) {
      if (j < this.state.followingList.length) {
        var userID = this.state.followingList[j];
      } else {
        var userID = this.state.userID;
      }
        
      try {
        const response = await fetch(
          `http://3.133.111.255:8080/locations/${userID}`,
          {
            method: "GET",
          }
        );

        const responseJson = await response.json();

        for (var i = 0; i < responseJson[0].length; i++) {
          tempList.push({
            locationID: responseJson[0][i].locationID,
            trackID: responseJson[0][i].trackID,
            userID: responseJson[0][i].userID,
            latitude: responseJson[0][i].latitude,
            longitude: responseJson[0][i].longitude,
            trackName: responseJson[0][i].trackName,
            displayName: responseJson[0][i].displayName,
            image: responseJson[0][i].userImage,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({
      locationList: tempList,
    });
    //console.log(this.state.locationList)
    return tempList;
  }

  addLocation(coordinate) {
    fetch(`http://3.133.111.255:8080/addlocation`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trackID: this.state.trackToAdd.trackID,
        userID: this.state.userID,
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      }),
    });
    console.log(this.state.trackToAdd.trackID + " added to location");

    this.fetchLocation();
  }

  deleteLocation(locationID) {
    fetch(`http://3.133.111.255:8080/deletelocation`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locationID: locationID,
        trackID: "",
        userID: 0,
        latitude: 0,
        longitude: 0,
      }),
    });
    for (var i = 0; i < this.state.locationList.length; i++) {
      if (locationID == this.state.locationList[i].locationID) {
        var returnList = this.state.locationList;
        returnList.splice(i, 1);
        this.setState({ locationList: returnList });
      }
    }
    console.log(locationID + " deleted");
  }

  addToPlaylist(musicList, playlistID) {
    fetch(`http://3.133.111.255:8080/addToPlaylist`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playlistID: playlistID,
        userID: this.state.userID,
        trackID: musicList
      }),
    });
  }

  async addPlaylist(loc, musicList) {
    const response = await fetch(`http://3.133.111.255:8080/addPlaylist`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: this.state.userID,
        playlistName: "user " + this.state.userID + " @ location " + loc.locationID,
      }),
    });
    const responseJson = await response.json();
    var playlistID = responseJson['playlistID']
    var tempList = []
    for (var i = 0; i < musicList.length; i++) {
      tempList.push(musicList[i]['trackID'])
    }
    console.log("playlist " + loc.trackName + " " + playlistID)
    this.addToPlaylist(tempList, playlistID)
  }

  addRecPin(loc, radius) {
    console.log(loc)
    var lat1 = loc.latitude;
    var lon1 = loc.longitude;

    var music_list = [];
    for (var i = 0; i < this.state.locationList.length; i++) {
      if (loc.locationID == this.state.locationList[i].locationID) {
        music_list.push({
          diff: 0,
          trackID: loc.trackID
        })
        continue;
      }

      var lat2 = this.state.locationList[i].latitude;
      var lon2 = this.state.locationList[i].longitude;

      var x = Math.abs(lat1 - lat2) * 69;
      var y = 0.0;
      var avg_lat_rad = ((Math.abs(lat1) + Math.abs(lat2)) / 2) * Math.PI * 180;

      if (lon2 * lon1 < 0) {
        y =
          Math.cos(avg_lat_rad) *
          24901 *
          Math.min(
            360 - Math.abs(lon1) - Math.abs(lon2),
            Math.abs(lon1) + Math.abs(lon2)
          );
      } else {
        y = Math.cos(avg_lat_rad) * 24901 * Math.abs(lon1 - lon2);
      }
      y /= 360;

      distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      diff = radius - distance;

      if (diff > 0) {
        var music_tuple = {};
        music_tuple["diff"] = diff;
        music_tuple["trackID"] = this.state.locationList[i].trackID;
        music_list.push(music_tuple);
      }
    }

    // sort by diff
    music_list.sort(function (a, b) {
      return a.diff - b.diff;
    });
    console.log(music_list)
    this.addPlaylist(loc, music_list)
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle}
          provider={PROVIDER_GOOGLE}
          initialRegion={this.state.initialRegion}
          region={this.state.mapRegion}
          mapPadding={{ top: 20, right: 20, buttom: 20, left: 20 }}
          paddingAdjustmentBehavior="automatic"
          ref={(ref) => (this.mapView = ref)}
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={true}
          onMapReady={this.goToInitialLocation.bind(this)}
          onLongPress={(e) => this.addLocation(e.nativeEvent.coordinate)}
        >
          {this.state.locationList.map((loc) => {
            return (
              <Marker
                coordinate={{
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                }}
                key={loc.locationID}
                title={loc.trackName}
                description={
                  "User: " +
                  loc.displayName +
                  "\n locationID: " +
                  loc.locationID
                }
                draggable
                onDragEnd={(e) =>
                  this.updateLocation(e.nativeEvent.coordinate, loc.locationID)
                }
                ref={(ref) => {
                  this.marker = ref;
                }}
              >
                <Callout onPress={() => this.createTwoButtonAlert(loc)}>
                  <CalloutSubview style={styles.callout}>
                    <Text style={styles.trackName}>{loc.trackName}</Text>
                    <Text style={styles.displayName}>{loc.displayName}</Text>
                    {/* <Text style={styles.displayName}>
                      locationID: {loc.locationID}
                    </Text> */}
                    <View style={styles.imageContainer}>
                      <Image
                        style={styles.image}
                        source={{ uri: loc.image}}
                      />
                    </View>
                  </CalloutSubview>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    flex: 1,
    justifyContent: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  callout: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  trackName: {
    fontFamily: "Noteworthy",
    fontWeight: "500",
    fontSize: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  displayName: {
    fontFamily: "Noteworthy",
    fontWeight: "500",
    fontSize: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    margin: 3,
    borderRadius: 25,
  },
});
