import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, StyleSheet, ScrollView, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getData = async (done) => {
  try {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const data = JSON.parse(jsonValue);
    return done(data);
  } catch (e) {
    console.error(e);
  }
};

class FriendRequestsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login_info: {},
      isLoading: true,
      outstanding: [],
    };
  }

  componentDidMount() {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: true,
        outstanding: [],
      });
      this.getFriendRequests();
    });
  }

  refresh = this.props.navigation.addListener('focus', () => {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: true,
        outstanding: [],
      });

      this.getFriendRequests();
    });
  });

  getFriendRequests = () => {
    console.log('Getting friend requests.....');
    return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
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
          outstanding: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  acceptFriendRequest = (other_user_id) => {
    console.log('Accepting a friend request.....');
    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${other_user_id}`, {
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
          isLoading: true,
        });
      })
      .then(this.getFriendRequests())
      .catch((error) => {
        console.log(error);
      });
  };

  rejectFriendRequest = (other_user_id) => {
    console.log('Rejecting a friend request.....');
    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${other_user_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.state.login_info.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: true,
        });
      })
      .then(this.getFriendRequests())
      .catch((error) => {
        console.log(error);
      });
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

            <FlatList
              data={this.state.outstanding}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text>
                    {item.first_name}
                    {' '}
                    {item.last_name}
                  </Text>

                  <View style={styles.buttonContainer}>
                    <Button
                      style={styles.buttonStyle}
                      title="Accept"
                      onPress={() => {
                        this.acceptFriendRequest(item.user_id);
                        this.setState({ outstanding: {}, isLoading: true }, () => {
                          this.getFriendRequests();
                        });
                      }}
                    />

                    <Button
                      style={styles.buttonStyle}
                      title="Reject"
                      onPress={() => {
                        this.rejectRequest(item.user_id);
                        this.setState({ outstanding: {}, isLoading: true }, () => {
                          this.getFriendRequests();
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

export default FriendRequestsScreen;