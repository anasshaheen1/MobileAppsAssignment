import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, StyleSheet, ScrollView, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (login, id) => {
  try {
    const jsonLogin = JSON.stringify(login);
    const jsonID = JSON.stringify(id);
    await AsyncStorage.setItem('@spacebook_details', jsonLogin);
    await AsyncStorage.setItem('@other_user_id', jsonID);
  } catch (e) {
    console.error(e);
  }
};

const getData = async (done) => {
  try {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const data = JSON.parse(jsonValue);
    return done(data);
  } catch (e) {
    console.error(e);
  }
};

class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login_info: {},
      isLoading: true,
      search_text: '',
      results: [],
      other_user_id: {},
    };
  }

  componentDidMount() {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: false,
      });
      this.search();
    });
  }

  search = () => {
    console.log('Searching...');
    return fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.search_text}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.state.login_info.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          results: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  sendFriendRequest = () => {
    console.log('Sending a friend request.....');
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.other_user_id}/friends`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.state.login_info.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  viewAccount = () => {
    storeData(this.state.login_info, this.state.other_user_id);
    this.props.navigation.navigate("User's Account");
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View><Text>Loading.....</Text></View>
      );
    }

    console.log('here', this.state);
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View>
          <View style={styles.flexContainer}>

            <TextInput
              style={styles.inputStyle}
              placeholder="Search....."
              onChangeText={(search_text) => {
                this.setState({ search_text }, () => {
                  this.search();
                });
              }}
              value={this.state.search_text}
            />

            <FlatList
              data={this.state.results.filter((item) => item.user_id !== this.state.login_info.id)}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text>
                    {item.user_givenname}
                    {' '}
                    {item.user_familyname}
                  </Text>

                  <View style={styles.buttonContainer}>
                    <Button
                      style={styles.buttonStyle}
                      title="View Account"
                      onPress={() => {
                        this.setState({ other_user_id: item.user_id }, () => {
                          this.viewAccount();
                        });
                      }}
                    />

                    <Button
                      style={styles.buttonStyle}
                      title="Add Friend"
                      onPress={() => {
                        this.setState({ other_user_id: item.user_id }, () => {
                          this.sendFriendRequest();
                        });
                      }}
                    />
                  </View>

                </View>
              )}
              keyExtractor={(item, index) => item.user_id}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  buttonStyle: {
    width: 50,
    height: 50,
    alignItems: 'center',

  },

  inputStyle: {
    width: '100%',
  },

  scrollView: {
    flex: 1,
    height: '100%',
    width: '100%',
    margin: 20,
    alignSelf: 'center',
  },
});

export default SearchScreen;