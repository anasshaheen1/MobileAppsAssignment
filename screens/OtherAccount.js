import React, { Component } from 'react';
import {
  Text, Image, View, StyleSheet,
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

const getOtherUser = async (done) => {
  try {
    const jsonValue = await AsyncStorage.getItem('@other_user_id');
    const data = JSON.parse(jsonValue);
    return done(data);
  } catch (e) {
    console.error(e);
  }
};

class AccountScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login_info: {},
      isLoading: true,
      info: {},
      photo: null,
    };
  }

  componentDidMount() {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: false,
        feed: {},
      });

      getOtherUser((id) => {
        this.setState({
          other_user_id: id,
        });

        this.getAccount();
        this.getAccountPic();
      });
    });
  }

  refresh = this.props.navigation.addListener('focus', () => {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: false,
        feed: {},
      });

      getOtherUser((id) => {
        this.setState({
          other_user_id: id,
        });

        this.getAccount();
        this.getAccountPicture();
      });
    });
  });

  getAccountPicture = () => {
    fetch(`http://localhost:3333/api/1.0.0/user/${this.state.other_user_id}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': this.state.login_info.token,
      },
    })
      .then((res) => res.blob())
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  getAccount = () => {
    console.log('Getting an account.....');
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.other_user_id}`, {
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
          info: responseJson,
        });
      })
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
      <View style={styles.flexContainer}>

        <Image
          source={{
            uri: this.state.photo,
          }}
          style={styles.imageStyle}
        />
        <Text>
          Name:
          {' '}
          {this.state.info.first_name}
          {' '}
          {this.state.info.last_name}
        </Text>
        <Text>
          Email address:
          {' '}
          {this.state.info.email}
        </Text>

      </View>

    );
  }
}

const styles = StyleSheet.create({
  imageStyle: {
    width: 295,
    height: 295,
    borderWidth: 10,
    alignSelf: 'flex-start',
  },

  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },

});

export default AccountScreen;