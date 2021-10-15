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
} from "react-native";
import { render } from "react-dom";

/* How to auto zoom into your current location using React Native Maps - by Arvind Chakraborty
 * https://medium.com/@arvind.chak128/how-to-auto-zoom-into-your-current-location-using-react-native-maps-88f9b3063fe7
 **/

var tesetData = {};

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
    };
    this.updateLocation = this.updateLocation.bind(this);
    this.addLocation = this.addLocation.bind(this);
    this.deleteLocation = this.deleteLocation.bind(this);
    this.fetchLocation(this.props.userID);
  }

  createTwoButtonAlert = (loc) =>
    Alert.alert(
      "Delete Location",
      "Are you sure you want to delete this location?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Delete", onPress: () => this.deleteLocation(loc.locationID) },
        {
          text: "Spotify",
          onPress: () => Linking.openURL(`spotify:track:${loc.trackID}`),
        },
        {
          text: "Playlist",
          onPress: (loc) => this.addRecPin(loc, 1),
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

  // Add a pin for recommendation list
  addRecPin(loc, radius) {
    // fetch(`http://3.133.111.255:8080/addlocation`, {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     // Linking to backend to extract maximum 10 music from surrounding locations
    //     //trackID: this.state.trackToAdd.trackID,
    //     playlistID: this.state.playlistID,          // Needs to add to the constructor
    //     userID: this.state.userID,
    //     latitude: coordinate.latitude,
    //     longitude: coordinate.longitude,
    //   }),
    // });
    var lat1 = loc.latitude;
    var lon1 = loc.longitude;

    var music_list = [];
    music_num = 0;
    for (var i = 0; i < this.state.locationList.length; i++) {
      if (loc.locationID == this.state.locationList[i].locationID) {
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

    //console.log(this.state.trackToAdd.trackID + " added user specified pin for playlist recommendation ");

    //this.fetchLocation(this.state.userID);
    console.log(music_list)
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

  async fetchLocation(userID) {
    try {
      const response = await fetch(
        `http://3.133.111.255:8080/locations/${userID}`,
        {
          method: "GET",
        }
      );
      const responseJson = await response.json();
      var tempList = [];
      for (var i = 0; i < responseJson[0].length; i++) {
        tempList.push({
          locationID: responseJson[0][i].locationID,
          trackID: responseJson[0][i].trackID,
          userID: responseJson[0][i].userID,
          latitude: responseJson[0][i].latitude,
          longitude: responseJson[0][i].longitude,
          trackName: responseJson[0][i].trackName,
          displayName: responseJson[0][i].displayName,
        });
      }
      this.setState({
        locationList: tempList,
      });
      return tempList;
    } catch (error) {
      console.log(error);
    }
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

    this.fetchLocation(this.state.userID);
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
                <Callout
                  onPress={() =>
                    this.createTwoButtonAlert(loc)
                  }
                >
                  <CalloutSubview style={styles.callout}>
                    <Text style={styles.trackName}>{loc.trackName}</Text>
                    <Text style={styles.displayName}>{loc.displayName}</Text>
                    <Text style={styles.displayName}>
                      locationID: {loc.locationID}
                    </Text>
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
});
