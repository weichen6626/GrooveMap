import React from 'react';
import {MapView} from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Image, TextInput } from 'react-native';

import {Button} from "react-native-elements";

import colors from "../config/colors";
import Icon from "react-native-vector-icons/FontAwesome"

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Icon name = "angle-left" style = {styles.back} size = "30"/>
        <Text style = {styles.title}>Email and Username</Text>
        <Text style = {styles.firstNameText}>Email</Text>
        <TextInput autoFocus={true} style = {styles.nameInput}/>
        <Text style = {styles.lastNameText}>Username</Text>
        <TextInput style = {styles.nameInput}/>
        <Button
          type="outline"
          buttonStyle={{ borderColor: "black", borderWidth: 1 }}
          titleStyle={{ color: "black" }}
          title="Next"
          style = {styles.signUpButton}
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
    resizeMode: "contain",
    marginTop: "14%",
    marginRight: "80%",
    marginBottom: "10%",
  },

  title: {
    fontFamily: "Arial",
    fontSize: 25,
    fontWeight: "400",
    paddingBottom: 20,
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
});
