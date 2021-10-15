import React from "react";
import MapView from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, Text, View, Dimensions, Image, Alert, TouchableHighlight, Linking, TouchableOpacity } from "react-native";


import colors from "../config/colors";

// const testData = {
//   count: 1,
//   users: {
//     userID: 22,
//     userName: "wch4",
//     password: "dick",
//     displayName: "Ben Huang",
//     numLocations: 15,
//     numPlaylists: 6,
//     numFollowers: 8,
//     numFollowing: 3,
//     userImage:
//       "https://scontent-ort2-2.cdninstagram.com/v/t51.2885-19/s150x150/70119508_1017289641935781_5681351695125184512_n.jpg?_nc_ht=scontent-ort2-2.cdninstagram.com&_nc_ohc=we_UZoYFljIAX_TsJbf&oh=67d813bc156b830315239a4138a59b79&oe=5FC52F35",
//   },
// };

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      userID: this.props.userID,
      displayName: this.props.displayName,
      userImage: this.props.userImage,
      numLocations: "",
      numPlaylists: "",
      numFollowers: "",
      numFollowing: "",
    };
    this.switchTab = this.switchTab.bind(this);
    this.numCounter();
  }

  switchTab(newTab) {
    this.props.switchTab(newTab);
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
      return responseJson[0].length;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchPlaylist(userID) {
    try {
      const response = await fetch(
        `http://3.133.111.255:8080/playlist/${userID}`,
        {
          method: "GET",
        }
      );
      const responseJson = await response.json();
      return responseJson.length;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchFollower(userID) {
    try {
      const response = await fetch(
        `http://3.133.111.255:8080/getFollowers/${userID}`,
        {
          method: "GET",
        }
      );
      const responseJson = await response.json();
      return responseJson.length;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchFollowing(userID) {
    try {
      const response = await fetch(
        `http://3.133.111.255:8080/getFollowing/${userID}`,
        {
          method: "GET",
        }
      );
      const responseJson = await response.json();
      return responseJson.length;
    } catch (error) {
      console.log(error);
    }
  }

  async numCounter() {
    var numLoc = await this.fetchLocation(this.state.userID);
    var numPList = await this.fetchPlaylist(this.state.userID);
    var numFollowers = await this.fetchFollower(this.state.userID);
    var numFollowing = await this.fetchFollowing(this.state.userID);
    this.setState({
      numLocations: numLoc,
      numPlaylists: numPList,
      numFollowers: numFollowers,
      numFollowing: numFollowing
    });
  }

  logout() {
    Alert.alert(
      "Logging out",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Confirm", onPress: () => {
          this.switchTab("LoginScreen");
          this.props.changeLoginStatus(false, -1, "", "", "")
        }},
      ],
      { cancelable: false }
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
        </View>

        <View style={styles.userInfo}>
          <TouchableOpacity
            activeOpacity={0.5}
            underlayColor="#e5e5e5"
            onPress={() => this.logout()}
          >
            <Image
              source={{ uri: this.state.userImage }}
              style={styles.profilePic}
            />
          </TouchableOpacity>

          <Text style={styles.title1}>{this.state.displayName}</Text>
          <Text style={styles.username}>@{this.state.username}</Text>
        </View>

        <View style={styles.stats}>
          <TouchableHighlight
            activeOpacity={0.5}
            underlayColor="#e5e5e5"
            onLongPress
            onPress={() => this.switchTab("MapScreen")}
          >
            <Text style={styles.numLocations}>
              # LOCATIONS: &nbsp;
              <Text>{this.state.numLocations}</Text>
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            activeOpacity={0.5}
            underlayColor="#e5e5e5"
            onLongPress
            onPress={() => this.switchTab("PlaylistScreen")}
          >
            <Text style={styles.playlists}>
              # PLAYLISTS: &nbsp;
              <Text>{this.state.numPlaylists}</Text>
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            activeOpacity={0.5}
            underlayColor="#e5e5e5"
            onLongPress
            onPress={() => this.switchTab("FollowScreen")}
          >
            <Text style={styles.followers}>
              # FOLLWERS: &nbsp;
              <Text>{this.state.numFollowers}</Text>
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            activeOpacity={0.5}
            underlayColor="#e5e5e5"
            onLongPress
            onPress={() => this.switchTab("FollowScreen")}
          >
            <Text style={styles.following}>
              # FOLLOWING: &nbsp;
              <Text>{this.state.numFollowing}</Text>
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    height: 60,
    alignItems: "center",
    justifyContent: "flex-end",
    margin: 5,
    paddingTop: "19%",
  },
  title: {
    fontFamily: "Noteworthy",
    fontWeight: "bold",
    fontSize: 25,
    height: 40,
  },
  title1: {
    fontFamily: "Noteworthy",
    fontWeight: "bold",
    fontSize: 25,
  },
  profilePic: {
    width: 120,
    height: 120,
    margin: 20,
    borderRadius: 100,
  },
  userInfo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  stats: {
    flex: 1,
    justifyContent: "center",
  },
  username: {
    fontSize: 20,
    fontFamily: "Noteworthy",
    fontStyle: "italic",
    textAlign: "center",
    color: "gray",
  },
  numLocations: {
    fontFamily: "Noteworthy",
    fontSize: 20,
    alignItems: "center",
    height: 50,
    padding: 10,
    backgroundColor: colors.mainColor,
    color: "white",
  },
  playlists: {
    fontFamily: "Noteworthy",
    fontSize: 20,
    alignItems: "center",
    height: 50,
    padding: 10,
    backgroundColor: "powderblue",
    color: "white",
  },
  followers: {
    fontFamily: "Noteworthy",
    fontSize: 20,
    alignItems: "center",
    height: 50,
    padding: 10,
    backgroundColor: "skyblue",
    color: "white",
  },
  following: {
    fontFamily: "Noteworthy",
    fontSize: 20,
    alignItems: "center",
    height: 50,
    padding: 10,
    backgroundColor: "steelblue",
    color: "white",
  },
});
