import React from "react";
import MapView from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  FlatList,
  SectionList,
  Linking,
  Image,
  Keyboard,
  TouchableOpacity,
  Alert
} from "react-native";
import { SearchBar } from "react-native-elements";

import colors from "../config/colors";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: this.props.userID,
      searchBarFocused: false,
      playLists: [],
      DATA: [],
    };
    this.addMarker = this.addMarker.bind(this);
    this.switchTab = this.switchTab.bind(this);
    this.fetchPlaylist();
  }

  switchTab(newTab) {
    this.props.switchTab(newTab);
  }

  addMarker(item) {
    Alert.alert(
      "Add Location",
      "Are you sure you want to pin this song?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            this.props.addMarker(item);
            this.switchTab("MapScreen");
          },
        },
      ],
      { cancelable: false }
    );
  }

  async getTrackName(trackID) {
    const response = await fetch(
      `http://3.133.111.255:8080/getTrackName/${trackID}`,
      {
        method: "GET",
      }
    );
    const responseJson = await response.json();
    return responseJson[0].trackName;
  }

  async loadTrackName() {
    var tempList = [];
    for (var i = 0; i < this.state.playLists.length; i++) {
      var trackList = [];
      for (var j = 0; j < this.state.playLists[i].trackID.length; j++) {
        var trackID = this.state.playLists[i].trackID[j];
        var trackName = await this.getTrackName(trackID);
        trackList.push({
          trackName: trackName,
          trackID: trackID,
        });
      }
      tempList.push({
        title: this.state.playLists[i].playlistName,
        playlistID: this.state.playLists[i].playlistID,
        data: trackList,
      });
    }
    this.setState({
      DATA: tempList,
    });
  }

  createTwoButtonAlert = (trackID) =>
    Alert.alert(
      "Play on Spotify",
      "Are you sure you want to play on Spotify?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => Linking.openURL(`spotify:track:${trackID}`),
        },
      ],
      { cancelable: false }
    );

  async fetchPlaylist() {
    try {
      const response = await fetch(
        `http://3.133.111.255:8080/playlist/${this.state.userID}`,
        {
          method: "GET",
        }
      );
      const responseJson = await response.json();
      var tempList = [];
      for (var i = 0; i < responseJson.length; i++) {
        var trackList = [];
        for (var j = 0; j < responseJson[i].trackID.length; j++) {
          trackList.push(responseJson[i].trackID[j]);
        }
        tempList.push({
          playlistID: responseJson[i].playlistID,
          playlistName: responseJson[i].name,
          userID: responseJson[i].userID,
          trackID: trackList,
        });
      }
      this.setState({
        playLists: tempList,
      });
      this.loadTrackName();
    } catch (error) {
      console.log(error);
    }
  }

  deletePlaylistHelper(playlistID) {
    fetch(`http://3.133.111.255:8080/delPlaylist`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playlistID: playlistID
      }),
    });
    this.fetchPlaylist();
  }

  deletePlaylist(playlistID){
    Alert.alert(
      "Delete Playlist",
      "Are you sure you want to delete this playlist?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => this.deletePlaylistHelper(playlistID)
        },
      ],
      { cancelable: false }
    );
  }
    

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Playlists</Text>
        </View>

        <SectionList
          style={styles.flatList}
          sections={this.state.DATA}
          renderSectionHeader={({ section: { title, playlistID } }) => (
            <TouchableHighlight
              activeOpacity={0.5}
              underlayColor="#e5e5e5"
              onLongPress={() => this.deletePlaylist(playlistID)}
            >
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
              </View>
            </TouchableHighlight>
          )}
          renderItem={({ item }) => (
            <TouchableHighlight
              activeOpacity={0.5}
              underlayColor="#e5e5e5"
              onPress={() => this.addMarker(item)}
              onLongPress={() => this.createTwoButtonAlert(item.trackID)}
            >
              <View style={styles.item}>
                <Text style={styles.name}>{item.trackName}</Text>
              </View>
            </TouchableHighlight>
          )}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  sectionHeader: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#e5e5e5",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 50,
    borderColor: "#e5e5e5",
    borderBottomWidth: 2,
    borderTopWidth: 2,
    paddingLeft: 15,
    paddingRight: 15,
  },
  sectionTitle: {
    fontFamily: "Noteworthy",
    fontWeight: "bold",
    fontSize: 18,
  },
  name: {
    fontFamily: "Noteworthy",
    fontWeight: "bold",
    fontSize: 15,
  },
  title: {
    fontFamily: "Noteworthy",
    fontWeight: "bold",
    fontSize: 25,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    //justifyContent: "space-evenly",
    alignItems: "center",
    height: 70,
    borderColor: "#e5e5e5",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  info: {
    flex: 4,
    justifyContent: "space-evenly",
  },
  star: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 30,
    height: 30,
  },
  header: {
    height: 70,
    alignItems: "center",
    justifyContent: "flex-end",
    margin: 5,
  },
  flatList: {
    backgroundColor: "#e5e5e5",
  },
  owner: {
    color: "gray",
  },
  description: {
    fontStyle: "italic",
  },
  button: {
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
    width: 20,
    height: 20,
  },
});


  // componentDidMount() {
  //   this.keyboardDidShow = Keyboard.addListener(
  //     "keyboardDidShow",
  //     this.keyboardDidShow
  //   );
  //   this.keyboardWillShow = Keyboard.addListener(
  //     "keyboardWillShow",
  //     this.keyboardWillShow
  //   );
  //   this.keyboardWillHide = Keyboard.addListener(
  //     "keyboardWillHide",
  //     this.keyboardWillHide
  //   );
  //   this.mounted = true;
  // }

  // componentWillUnmount() {
  //   this.keyboardDidShow.remove();
  //   this.keyboardWillShow.remove();
  //   this.keyboardWillHide.remove();
  //   this.mounted = false;
  // }

  // keyboardDidShow = () => {
  //   this.setState({ searchBarFocused: true });
  // };

  // keyboardWillShow = () => {
  //   this.setState({ searchBarFocused: true });
  // };

  // keyboardWillHide = () => {
  //   this.setState({ searchBarFocused: false });
  // };