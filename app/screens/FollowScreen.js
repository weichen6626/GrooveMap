import React, { Component } from "react";
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
  Alert,
  Button,
} from "react-native";

import { SearchBar } from "react-native-elements";

class UserListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFollowing: this.props.item.isFollowing,
    };
  }

  render() {
    return (
      <View style={styles.item}>
        <Image style={styles.image} source={{ uri: this.props.item.image }} />
        <Text style={styles.name}>{this.props.item.displayName}</Text>
        <View style={styles.button}>
          <Button
            onPress={() => {
              if (this.state.isFollowing) {
                this.props.unfollow(this.props.item.userID);
                this.setState({ isFollowing: false });
              } else {
                this.props.addFollowing(this.props.item.userID);
                this.setState({ isFollowing: true });
              }
            }}
            title={this.state.isFollowing ? "Following" : "Follow"}
            color={this.state.isFollowing ? "#02c9c9" : "gray"}
          />
        </View>
      </View>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: this.props.userID,
      searchBarFocused: false,
      searchText: "",
      searchResult: [],
      userList: [],
      followingList: {},
    };
    this.filterSearch = this.filterSearch.bind(this);
    this.switchTab = this.switchTab.bind(this);
    this.inFollowingList = this.inFollowingList.bind(this);
    this.addFollowing = this.addFollowing.bind(this);
    this.unfollow = this.unfollow.bind(this);
    this.fetchFollowing = this.fetchFollowing.bind(this);
    this.fetchFollowing();
    this.fetchUser();
  }

  switchTab(newTab) {
    this.props.switchTab(newTab);
  }

  async filterSearch(text) {
    this.setState({ searchText: text });
    this.state.searchResult = [];
    for (var i = 0; i < this.state.userList.length; i++) {
      if (
        this.state.userList[i].displayName
          .toLowerCase()
          .includes(text.toString().toLowerCase())
      ) {
        this.state.searchResult.push(this.state.userList[i]);
      }
    }
  }

  clearInput() {
    this.setState({ searchText: "" });
  }

  getRenderData() {
    if (this.state.searchText.length == 0) {
      return this.state.userList;
    } else {
      return this.state.searchResult;
    }
  }

  addFollowing(followedID) {
    fetch(`http://3.133.111.255:8080/addfollowing`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followerID: this.state.userID,
        followedID: followedID,
      }),
    });

    this.fetchFollowing();
  }

  unfollow(followedID) {
    fetch(`http://3.133.111.255:8080/unfollow`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followerID: this.state.userID,
        followedID: followedID,
      }),
    });
    this.fetchFollowing();
  }

  inFollowingList(userID) {
    if (this.state.followingList[userID] == true) {
      return true;
    }
    return false;
  }

  async fetchUser() {
    try {
      const response = await fetch(`http://3.133.111.255:8080/userTable`, {
        method: "GET",
      });
      const responseJson = await response.json();
      var tempList = [];
      for (var i = 0; i < responseJson.length; i++) {
        if (responseJson[i].userID != this.state.userID) {
          if (this.inFollowingList(responseJson[i].userID)) {
            tempList.push({
              userID: responseJson[i].userID,
              displayName: responseJson[i].displayName,
              username: responseJson[i].userName,
              password: responseJson[i].userPassword,
              image: responseJson[i].userImage,
              isFollowing: true,
            });
          } else {
            tempList.push({
              userID: responseJson[i].userID,
              displayName: responseJson[i].displayName,
              username: responseJson[i].userName,
              password: responseJson[i].userPassword,
              image: responseJson[i].userImage,
              isFollowing: false,
            });
          }
        }
      }
      this.setState({
        userList: tempList,
      });
      return tempList;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchFollowing() {
    try {
      const response = await fetch(
        `http://3.133.111.255:8080/getfollowing/${this.state.userID}`,
        {
          method: "GET",
        }
      );
      const responseJson = await response.json();
      var tempList = {};
      for (var i = 0; i < responseJson.length; i++) {
        tempList[responseJson[i].followedID] = true;
      }
      this.setState({
        followingList: tempList,
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Follow</Text>
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
          placeholder="Name"
          value={this.state.searchText}
        />

        <FlatList
          style={styles.flatList}
          data={this.getRenderData()}
          renderItem={({ item }) => (
            <UserListItem
              item={item}
              addFollowing={this.addFollowing}
              unfollow={this.unfollow}
            />
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
  item: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 88,
    borderColor: "#e5e5e5",
    borderBottomWidth: 2,
    borderTopWidth: 2,
    paddingLeft: 30,
    paddingRight: 20,
  },
  info: {
    flex: 4,
    justifyContent: "space-evenly",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 40,
    borderRadius: 25,
  },
  star: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    height: 70,
    alignItems: "flex-end",
    justifyContent: "space-evenly",
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
    fontFamily: "Noteworthy",
    fontWeight: "bold",
    fontSize: 15,
  },
  owner: {
    color: "gray",
  },
  description: {
    fontStyle: "italic",
  },
  button: {
    marginLeft: "auto",
    height: "100%",
    alignItems: "center",
    flexDirection: "row",
    margin: 10,
  },
  flatList: {
    backgroundColor: "#e5e5e5",
    height: "100%",
  },
});
