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
  Linking,
  Image,
  Keyboard,
  TouchableOpacity,
  Alert
} from "react-native";
import { SearchBar } from "react-native-elements";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchBarFocused: false,
      trackList: [],
      searchText: "",
      searchResult: [],
    };
    this.filterSearch = this.filterSearch.bind(this);
    this.addMarker = this.addMarker.bind(this);
    this.switchTab = this.switchTab.bind(this);
    this.fetchTrack();
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
        { text: "Confirm", onPress: () => {
          this.props.addMarker(item);
          this.switchTab("MapScreen");} 
        },
      ],
      { cancelable: false }
    );
  }

  async fetchTrack() {
    try {
      const response = await fetch(`http://3.133.111.255:8080/tracks`, {
        method: "GET",
      });
      const responseJson = await response.json();
      var tempList = [];
      for (var i = 0; i < responseJson.length; i++) {
        tempList.push({
          trackID: responseJson[i].trackID,
          trackName: responseJson[i].trackName,
          trackNumber: responseJson[i].trackNumber,
          albumID: responseJson[i].albumID,
        });
      }
      this.setState({
        trackList: tempList,
      });
      return tempList;
    } catch (error) {
      console.log(error);
    }
  }

  async filterSearch(text) {
    this.setState({ searchText: text });
    this.state.searchResult = [];
    for (var i = 0; i < this.state.trackList.length; i++) {
      if (
        this.state.trackList[i].trackName
          .toLowerCase()
          .includes(text.toString().toLowerCase())
      ) {
        this.state.searchResult.push(this.state.trackList[i]);
      }
    }
  }

  clearInput() {
    this.setState({ searchText: "" });
  }

  getRenderData() {
    if (this.state.searchText.length == 0) {
      return this.state.trackList;
    } else {
      return this.state.searchResult;
    }
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
        { text: "Confirm", onPress: () => Linking.openURL(`spotify:track:${trackID}`) },
      ],
      { cancelable: false }
    );

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Music Library</Text>
        </View>

        <SearchBar
          round
          inputStyle={{ backgroundColor: "white" }}
          containerStyle={{
            backgroundColor: "#e5e5e5",
            borderTopWidth: 0,
            borderBottomWidth: 0,
          }}
          inputContainerStyle={{ backgroundColor: "white" }}
          searchIcon={{ size: 23 }}
          onChangeText={(text) => this.filterSearch(text)}
          onClear={(text) => this.clearInput()}
          placeholder="Track Name"
          value={this.state.searchText}
        />

        <FlatList
          style={styles.flatList}
          data={this.getRenderData()}
          renderItem={({ item }) => (
            <TouchableHighlight
              activeOpacity={0.5}
              underlayColor="#e5e5e5"
              onLongPress={() => this.createTwoButtonAlert(item.trackID)}
              onPress={() => this.addMarker(item)}
            >
              <View style={styles.item} key={item.trackID}>
                <View style={styles.info}>
                  <Text style={styles.name}>{item.trackName}</Text>
                  <Text style={styles.owner}>
                    Track number: {item.trackNumber}
                  </Text>
                  <Text style={styles.description}>
                    Album ID: {item.albumID}
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
          )}
          keyExtractor={(item) => item.trackID}
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
  item: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-evenly",
    height: 120,
    borderColor: "#e5e5e5",
    borderBottomWidth: 2,
    borderTopWidth: 2,
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
  title: {
    fontFamily: "Noteworthy",
    fontWeight: "bold",
    fontSize: 25,
  },
  flatList: {
    backgroundColor: "#e5e5e5",
  },
  name: {
    fontWeight: "bold",
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
