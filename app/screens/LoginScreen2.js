import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
} from "react-native";

import { Button } from "react-native-elements";

import colors from "../config/colors";
import Icon from "react-native-vector-icons/FontAwesome";

//Icons made by <a href="https://www.flaticon.com/authors/freepik"
//title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/"
//title="Flaticon">www.flaticon.com</a></div>

// const testData = {
//   count: 2,
//   users: [
//     {
//       userID: 22,
//       userName: "wch4",
//       password: "d",
//       displayName: "Ben Huang",
//       userImage:
//         "https://static.toiimg.com/thumb/msid-67586673,width-800,height-600,resizemode-75,imgsize-3918697,pt-32,y_pad-40/67586673.jpg",
//     },
//     {
//       userID: 15,
//       userName: "ytsu2",
//       password: "meathead99",
//       displayName: "Eric Su",
//       userImage:
//         "https://scontent-ort2-2.cdninstagram.com/v/t51.2885-19/s150x150/70119508_1017289641935781_5681351695125184512_n.jpg?_nc_ht=scontent-ort2-2.cdninstagram.com&_nc_ohc=we_UZoYFljIAX_TsJbf&oh=67d813bc156b830315239a4138a59b79&oe=5FC52F35",
//     },
//   ],
// };

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputBarFocused: false,
      userList: [],
      username: "",
      password: "",
      loginMessage: "",
    };
    this.checkCredential = this.checkCredential.bind(this);
    this.switchTab = this.switchTab.bind(this);
    this.changeLoginStatus = this.changeLoginStatus.bind(this);
    this.fetchUser();
  }

  switchTab(newTab) {
    this.props.switchTab(newTab);
  }

  changeLoginStatus(loggedIn, userID, displayName, userImage, username) {
    this.props.changeLoginStatus(loggedIn, userID, displayName, userImage, username);
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
          userImage: responseJson[i].userImage
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

  checkCredential() {
    if (this.state.username.trim() === "") {
      this.setState({ loginMessage: "Please enter a username." });
      return;
    }
    if (this.state.password.trim() === "") {
      this.setState({ loginMessage: "Please enter a password." });
      return;
    }

    for (var i = 0; i < this.state.userList.length; i++) {
      if ( 
        this.state.userList[i].username === this.state.username &&
        this.state.userList[i].password === this.state.password
      ) {
        this.changeLoginStatus(
          true,
          this.state.userList[i].userID,
          this.state.userList[i].displayName,
          this.state.userList[i].userImage,
          this.state.userList[i].username
        );
        this.switchTab("MapScreen");
        return;
      }
    }
    this.setState({ loginMessage: "Username and/or password are incorrect." });
  }

  async setUsername(text) {
    this.setState({ username: text.trim() });
  }

  async setPassword(text) {
    this.setState({ password: text.trim() });
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
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Groove Map</Text>
        <Text style={styles.usernameText}>Username</Text>
        <TextInput
          autoFocus={true}
          style={styles.username}
          onChangeText={(text) => this.setUsername(text)}
          onClear={(text) => this.setState({ username: "" })}
        />
        <Text style={styles.passwordText}>Password</Text>
        <TextInput
          secureTextEntry
          style={styles.password}
          onChangeText={(text) => this.setPassword(text)}
          onClear={() => this.setState({ password: "" })}
        />
        <Text style={styles.errorMessage}>{this.state.loginMessage}</Text>
        <Button
          type="outline"
          buttonStyle={{ borderColor: "black", borderWidth: 1 }}
          titleStyle={{ color: "black" }}
          style={styles.loginButton}
          title="Login"
          onPress={() => this.checkCredential()}
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
    //resizeMode: 'contain',
    marginTop: "14%",
    marginRight: "80%",
  },

  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },

  title: {
    fontFamily: "Noteworthy",
    fontSize: 20,
    fontWeight: "500",
    paddingBottom: 20,
    paddingLeft: 6,
  },

  username: {
    borderColor: "black",
    borderWidth: 1,
    height: 40,
    width: "80%",
  },

  password: {
    borderColor: "black",
    borderWidth: 1,
    height: 40,
    width: "80%",
  },

  usernameText: {
    alignSelf: "baseline",
    marginLeft: "10%",
  },

  errorMessage: {
    marginTop: "3%",
    color: "#cc0000",
  },

  passwordText: {
    marginTop: "3%",
    alignSelf: "baseline",
    marginLeft: "10%",
  },

  loginButton: {
    width: 150,
    marginTop: "5%",
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
  //   this.setState({ inputBarFocused: true });
  // };

  // keyboardWillShow = () => {
  //   this.setState({ inputBarFocused: true });
  // };

  // keyboardWillHide = () => {
  //   this.setState({ inputBarFocused: false });
  // };