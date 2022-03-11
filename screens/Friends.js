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

class FriendsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login_info: {},
      isLoading: true,
      search_text: '',
      results: [],
      other_user_id: {},
      profile: {},
    };
  }

  componentDidMount() {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: false,
      });
      this.search();
      this.getAccount();
    });
  }

  refresh = this.props.navigation.addListener('focus', () => {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: false,
      });
      this.search();
      this.getAccount();
    });
  });

  getAccount = () => {
    console.log('Getting an existing account.....');
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.login_info.id}`, {
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
          profile: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  search = () => {
    console.log('Searching.....');
    return fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.search_text}&search_in=friends`, {
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

  viewWall = () => {
    storeData(this.state.login_info, this.state.other_user_id);
    this.props.navigation.navigate("Friend's Home");
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

            <Text>
              {this.state.profile.friend_count}
                is your total number of friends and friend requests
              {' '}
            </Text>

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
                      title="View Wall"
                      onPress={() => {
                        this.setState({ other_user_id: item.user_id }, () => {
                          this.viewWall();
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
  scrollView: {
    flex: 1,
    height: '95%',
    width: '95%',
    margin: 15,
    alignSelf: 'flex-start',
  },

  inputStyle: {
    width: '95%',
  },

  buttonStyle: {
    width: 65,
    height: 65,
    alignItems: 'flex-start',

  },

  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default FriendsScreen;