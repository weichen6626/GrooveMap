import React from "react";
import { MapView } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
} from "react-native";

import { Button } from "react-native-elements";

import colors from "../config/colors";
import Icon from "react-native-vector-icons/FontAwesome";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      inputBarFocused: false,
      username: "",
      password: "",
      password2: "",
    };
    this.signupTab = this.signupTab.bind(this);
    this.switchTab = this.switchTab.bind(this);
    this.fetchUser();
  }

  signupTab() {
    this.props.signupTab(this.state.username, this.state.password);
  }

  switchTab(newTab) {
    this.props.switchTab(newTab);
  }

  async fetchUser() {
    try {
      const response = await fetch(`http://3.133.111.255:8080/usertable`, {
        method: "GET",
      });
      const responseJson = await response.json();
      var tempList = [];
      for (var i = 0; i < responseJson.length; i++) {
        tempList.push({
          username: responseJson[i].userName,
          password: responseJson[i].userPassword,
          userID: responseJson[i].userID,
          displayName: responseJson[i].displayName,
          userImage: responseJson[i].userImage,
          signupMessage: "",
        });
      }
      this.setState({
        userList: tempList,
      });
      return tempList;
    } catch (error) {
      console.log(error);
    }
  }

  async setUsername(text) {
    this.setState({ username: text.trim() });
  }

  async setPassword(text) {
    this.setState({ password: text.trim() });
  }

  async setPassword2(text) {
    this.setState({ password2: text.trim() });
  }

  checkSignupInfo() {
    // check username
    if (this.state.username.trim() === "") {
      this.setState({ signupMessage: "Please enter a username." });
      return;
    }

    for (var i = 0; i < this.state.userList.length; i++) {
      if (this.state.userList[i].username === this.state.username) {
        this.setState({
          signupMessage: "Username taken, please select another username.",
        });
        return;
      }
    }

    // check password
    if (this.state.password.trim() === "") {
      this.setState({ signupMessage: "Please enter a password." });
      return;
    }

    if (this.state.password2.trim() === "") {
      this.setState({ signupMessage: "Please confirm password." });
      return;
    }

    if (this.state.password.trim() != this.state.password2.trim()) {
      this.setState({ signupMessage: "Passwords do not match." });
      return;
    }

    this.signupTab();
  }

  render() {
    return (
      <View style={styles.container}>
        <Icon
          name="angle-left"
          style={styles.back}
          onPress={() => {
            this.switchTab("LoginScreen");
          }}
          size={30}
        />
        <Text style={styles.title}>Create Account</Text>
        

        <Text style={styles.lastNameText}>Username</Text>
        <TextInput
          style={styles.nameInput} autoFocus = {true}
          onChangeText={(text) => this.setUsername(text)}
          onClear={() => this.setState({ username: "" })}
        />

        <Text style={styles.lastNameText}>Password</Text>
        <TextInput
          secureTextEntry
          style={styles.nameInput}
          onChangeText={(text) => this.setPassword(text)}
          onClear={() => this.setState({ password: "" })}
        />

        <Text style={styles.lastNameText}>Confirm Password</Text>
        <TextInput
          secureTextEntry
          style={styles.nameInput}
          onChangeText={(text) => this.setPassword2(text)}
          onClear={() => this.setState({ password2: "" })}
        />
        <Text style={styles.errorMessage}>{this.state.signupMessage}</Text>
        <Button
          type="outline"
          buttonStyle={{ borderColor: "black", borderWidth: 1 }}
          titleStyle={{ color: "black" }}
          title="Next"
          style={styles.signUpButton}
          onPress={() => this.checkSignupInfo()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainColor,
    alignItems: "center",
  },

  back: {
    height: 30,
    width: 30,
    paddingLeft: "2%",
    marginTop: "14%",
    marginRight: "80%",
    marginBottom: "5%",
  },

  title: {
    fontFamily: "Arial",
    fontSize: 25,
    fontWeight: "400",
    paddingLeft: 6,
  },

  nameInput: {
    borderColor: "black",
    borderWidth: 1,
    height: 40,
    width: "80%",
  },

  firstNameText: {
    alignSelf: "baseline",
    marginLeft: "10%",
  },

  lastNameText: {
    alignSelf: "baseline",
    marginLeft: "10%",
    marginTop: "3%",
  },

  signUpButton: {
    width: 150,
    marginTop: "5%",
  },

  errorMessage: {
    color: "#cc0000",
    paddingTop: "5%",
  },
});
