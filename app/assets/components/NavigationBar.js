import React, { Component } from "react";
import { render } from "react-dom";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";

// Icons made by <a href="https://www.flaticon.com/authors/gregor-cresnar"
// title="Gregor Cresnar">Gregor Cresnar</a> from <a href="https://www.flaticon.com/"
// title="Flaticon"> www.flaticon.com</a>

export default class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.switchTab = this.switchTab.bind(this);
  }

  switchTab(newTab) {
    this.props.switchTab(newTab);
  }

  render() {
    if (!this.props.loggedIn) {
      return null;
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.tab}>
            <TouchableOpacity
              onPress={() => {
                this.props.switchTab("MapScreen");
              }}
            >
              <Image
                source={
                  this.props.activeTab == "MapScreen"
                    ? require("../placeholder-clicked.png")
                    : require("../placeholder.png")
                }
                style={styles.button}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.tab}>
            <TouchableOpacity
              onPress={() => {
                this.props.switchTab("MusicScreen");
              }}
            >
              <Image
                source={
                  this.props.activeTab == "MusicScreen"
                    ? require("../musical-note-clicked.png")
                    : require("../musical-note.png")
                }
                style={styles.button}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.tab}>
            <TouchableOpacity
              onPress={() => {
                this.props.switchTab("PlaylistScreen");
              }}
            >
              <Image
                source={
                  this.props.activeTab == "PlaylistScreen"
                    ? require("../playlist-clicked.png")
                    : require("../playlist.png")
                }
                style={styles.button}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.tab}>
            <TouchableOpacity
              onPress={() => {
                this.props.switchTab("FollowScreen");
              }}
            >
              <Image
                source={
                  this.props.activeTab == "FollowScreen"
                    ? require("../stick-man-2-clicked.png")
                    : require("../stick-man-2.png")
                }
                style={styles.button}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.tab}>
            <TouchableOpacity
              onPress={() => {
                this.props.switchTab("UserScreen");
              }}
            >
              <Image
                source={
                  this.props.activeTab == "UserScreen"
                    ? require("../stick-man-1-clicked.png")
                    : require("../stick-man-1.png")
                }
                style={styles.button}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: 80,
    flexDirection: "row",
    alignItems: "stretch",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#b2b2b2",
    borderTopWidth: 1,
    paddingBottom: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    margin: 20,
  },
});
