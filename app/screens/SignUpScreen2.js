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
      username: this.props.signupUsername,
      password: this.props.signupPassword,
      image:
        "https://cdn.vox-cdn.com/thumbor/FSUavm-EmXt6dg46QSNu9o6rhFo=/0x0:800x400/1400x1400/filters:focal(336x136:464x264):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/56187477/DHNkdRfXoAEp2VD.0.jpg",
      displayName: "",
    };
    this.switchTab = this.switchTab.bind(this);
  }

  switchTab(newTab) {
    this.props.switchTab(newTab);
  }

  async setDisplayName(text) {
    this.setState({ displayName: text });
  }

  async setImage(text) {
    this.setState({ image: text});
    console.log("here")
  }

  checkSignupInfo() {
    if (this.state.displayName === "") {
      this.setState({ signupMessage: "Please enter your name." });
      return;
    }

    this.signup();
  }

  signup() {
    fetch(`http://3.133.111.255:8080/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: this.state.username,
        userPassword: this.state.password,
        displayName: this.state.displayName,
        userImage: this.state.image
      }),
    });
    console.log(this.state.username + " added to usertable");
    this.switchTab("LoginScreen")
  }

  render() {
    return (
      <View style={styles.container}>
        <Icon
          name="angle-left"
          style={styles.back}
          onPress={() => {
            this.switchTab("SignUpScreen");
          }}
          size={30}
        />
        <Text style={styles.title}>Profile</Text>

        <Text style={styles.lastNameText}>First and Last Name</Text>
        <TextInput
          style={styles.nameInput}
          autoFocus={true}
          onChangeText={(text) => this.setDisplayName(text)}
          onClear={() => this.setState({ displayName: "" })}
        />

        <Text style={styles.lastNameText}>Profile Image URL</Text>
        <Text style={styles.lastNameText2}>
          (Enter nothing for default image)
        </Text>
        <TextInput
          style={styles.nameInput}
          onChangeText={(text) => this.setImage(text)}
          onClear={() =>
            this.setState({
              image:
                "https://cdn.vox-cdn.com/thumbor/FSUavm-EmXt6dg46QSNu9o6rhFo=/0x0:800x400/1400x1400/filters:focal(336x136:464x264):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/56187477/DHNkdRfXoAEp2VD.0.jpg",
            })
          }
        />

        <Text style={styles.errorMessage}>{this.state.signupMessage}</Text>

        <Button
          type="outline"
          buttonStyle={{ borderColor: "black", borderWidth: 1 }}
          titleStyle={{ color: "black" }}
          title="Signup"
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

  lastNameText2: {
    alignSelf: "baseline",
    marginLeft: "10%",
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
