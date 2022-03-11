import React, { Component } from 'react';
import {
  Text, View, Button, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import WallScreen from './Wall';
import AccountScreen from './Account';
import FriendsScreen from './Friends';
import FriendRequestsScreen from './FriendRequests';
import SearchScreen from './Search';

const getData = async (done) => {
  try {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const data = JSON.parse(jsonValue);
    return done(data);
  } catch (e) {
    console.error(e);
  }
};

const Tab = createBottomTabNavigator();

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login_info: {},
      isLoading: true,
    };
  }

  componentDidMount() {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: false,
      });
    });
  }

  refresh = this.props.navigation.addListener('focus', () => {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: false,
      });
    });
  });

  logout = () => {
    fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.state.login_info.token,
      },

    })
      .then((json) => {
        console.log(json);
        this.props.navigation.navigate('Sign In'); 
      })
      .catch((error) => {
        console.error(error);
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
      <View style={{ flex: 1, alignItems: 'space-around', justifyContent: 'space-around' }}>

        <Button
          style={styles.buttonStyle}
          title="Log Out"
          onPress={() => this.logout()}
        />

        <Tab.Navigator
          style={{ justifyContent: 'center' }}
          screenOptions={({ route }) => ({
            tabBarActiveTintColor: 'red',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Wall" component={WallScreen} />
          <Tab.Screen name="Account" component={AccountScreen} />
          <Tab.Screen name="Friends" component={FriendsScreen} />
          <Tab.Screen name="Friend Requests" component={FriendRequestsScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
        </Tab.Navigator>

      </View>

    );
  }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  
  buttonStyle: {
    width: 75,
    height: 75,
    alignItems: 'center',

  },
  
});

export default HomeScreen;