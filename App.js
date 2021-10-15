import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {
  ImagePropTypes,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import NavigationBar from "./app/assets/components/NavigationBar";
import LoginScreen from "./app/screens/LoginScreen";
import MapScreen from "./app/screens/MapScreen";
import MusicScreen from "./app/screens/MusicScreen";
import UserScreen from "./app/screens/UserScreen";
import FollowScreen from "./app/screens/FollowScreen";
import LoginScreen2 from "./app/screens/LoginScreen2";
import PlaylistScreen from "./app/screens/PlaylistScreen";
import SignUpScreen from "./app/screens/SignUpScreen";
import SignUpScreen2 from "./app/screens/SignUpScreen2";
import SignUpScreen3 from "./app/screens/SignUpScreen3";
import SignUpScreen4 from "./app/screens/SignUpScreen4";

// Icons made by <a href="https://www.flaticon.com/authors/gregor-cresnar"
// title="Gregor Cresnar">Gregor Cresnar</a> from <a href="https://www.flaticon.com/"
// title="Flaticon"> www.flaticon.com</a>

// Icons made by <a href="https://www.flaticon.com/authors/gregor-cresnar"
// title="Gregor Cresnar">Gregor Cresnar</a> from <a href="https://www.flaticon.com/"
// title="Flaticon"> www.flaticon.com</a>

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "LoginScreen",
      loggedIn: false,
      userID: -1,
      displayName: "",
      userImage: "",
      username: "",
      trackToAdd: {},
      signupUsername: "",
      signupPassword: "",
    };
    this.switchTab = this.switchTab.bind(this);
    this.signupTab = this.signupTab.bind(this);
    this.addMarker = this.addMarker.bind(this);
    this.changeLoginStatus = this.changeLoginStatus.bind(this);
  }

  switchTab(newTab) {
    this.setState({ activeTab: newTab });
  }

  signupTab(username, password) {
    this.setState({
      activeTab: "SignUpScreen2",
      signupUsername: username,
      signupPassword: password,
    });
  }

  changeLoginStatus(loggedIn, loginUserID, displayName, userImage, username) {
    this.setState({
      loggedIn: loggedIn,
      displayName: displayName,
      userImage: userImage,
      username: username,
      userID: loginUserID,
    });
  }

  addMarker(track) {
    this.setState({ trackToAdd: track });
  }

  render() {
    let tabPage = "";

    if (this.state.activeTab == "MapScreen") {
      tabPage = (
        <MapScreen
          userID={this.state.userID}
          trackToAdd={this.state.trackToAdd}
        />
      );
    } else if (this.state.activeTab == "MusicScreen") {
      tabPage = (
        <MusicScreen switchTab={this.switchTab} addMarker={this.addMarker} />
      );
    } else if (this.state.activeTab == "FollowScreen") {
      tabPage = (
        <FollowScreen userID={this.state.userID} switchTab={this.switchTab} />
      );
    } else if (this.state.activeTab == "PlaylistScreen") {
      tabPage = (
        <PlaylistScreen
          switchTab={this.switchTab}
          userID={this.state.userID}
          addMarker={this.addMarker}
        />
      );
    } else if (this.state.activeTab == "UserScreen") {
      tabPage = (
        <UserScreen
          switchTab={this.switchTab}
          userID={this.state.userID}
          username={this.state.username}
          userImage={this.state.userImage}
          displayName={this.state.displayName}
          changeLoginStatus={this.changeLoginStatus}
        />
      );
    } else if (this.state.activeTab == "LoginScreen") {
      tabPage = <LoginScreen switchTab={this.switchTab} />;
    } else if (this.state.activeTab == "LoginScreen2") {
      tabPage = (
        <LoginScreen2
          switchTab={this.switchTab}
          changeLoginStatus={this.changeLoginStatus}
        />
      );
    } else if (this.state.activeTab == "SignUpScreen") {
      tabPage = (
        <SignUpScreen signupTab={this.signupTab} switchTab={this.switchTab} />
      );
    } else if (this.state.activeTab == "SignUpScreen2") {
      tabPage = (
        <SignUpScreen2
          switchTab={this.switchTab}
          signupUsername={this.state.signupUsername}
          signupPassword={this.state.signupPassword}
        />
      );
    }
    // } else if (this.state.activeTab == "SignUpScreen3") {
    //   tabPage = <SignUpScreen3 />;
    // } else if (this.state.activeTab == "SignUpScreen5") {
    //   tabPage = <SignUpScreen4 />;
    // }

    return (
      <View style={styles.container}>
        <StatusBar style="inverted" />
        {tabPage}
        <NavigationBar
          loggedIn={this.state.loggedIn}
          activeTab={this.state.activeTab}
          switchTab={this.switchTab}
        ></NavigationBar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
});
