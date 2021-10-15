import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from "react-native";
import { Button, Icon } from "react-native-elements";

import LoginScreen2 from "./LoginScreen2";
import NavigationBar from "../assets/components/NavigationBar";
import SignUpScreen from './SignUpScreen';
import SignUpScreen2 from './SignUpScreen2';
import SignUpScreen3 from './SignUpScreen3';
import SignUpScreen4 from './SignUpScreen4';

import colors from "../config/colors";

//Icons made by <a href="https://www.flaticon.com/authors/freepik"
//title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/"
//title="Flaticon">www.flaticon.com</a></div>

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.switchTab = this.switchTab.bind(this);
  }

  switchTab(newTab) {
    this.props.switchTab(newTab);
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Groove Map</Text>
        <Button
          type="outline"
          buttonStyle={{
            borderColor: "black",
            borderWidth: 2,
            marginVertical: 20,
          }}
          titleStyle={styles.loginButton}
          title="Log in"
          onPress={() => {
            this.switchTab("LoginScreen2");
          }}
        />
        <Button
          type="outline"
          buttonStyle={{ borderColor: "black", borderWidth: 2 }}
          titleStyle={styles.loginButton}
          title="Sign up"
          onPress={() => {
            this.switchTab("SignUpScreen");
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainColor,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 170,
    height: 170,
    paddingTop: 40,
    //resizeMode: "contain",
  },

  title: {
    fontFamily: "Noteworthy",
    fontSize: 40,
    fontWeight: "500",
    paddingBottom: 40,
    paddingLeft: 6,
  },

  loginButton: {
    textAlign: "center",
    fontFamily: "Arial",
    fontSize: 23,
    color: "black",
    margin: 10,
    fontWeight: "bold",
    width: "50%",
  },

  signUpButton: {
    textAlign: "center",
    fontFamily: "Arial",
    fontSize: 23,
    color: "black",
    margin: 30,
    fontWeight: "bold",
    width: "80%",
  },
});
