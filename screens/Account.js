import React, { Component } from 'react';
import {
  Text, Image, View, Button, StyleSheet,
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
        info: {},
      });

      this.getAccount();
      this.getAccountPic();
    });
  }

  refresh = this.props.navigation.addListener('focus', () => {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: false,
        info: {},
      });

      this.getAccount();
      this.getAccountPic();
    });
  });

  getAccountPicture = () => {
    fetch(`http://localhost:3333/api/1.0.0/user/${this.state.login_info.id}/photo`, {
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

        <View>
          <Image
            source={{
              uri: this.state.photo,
            }}
            style={styles.imageStyle}
          />

        </View>

        <View style={styles.flexContainer}>
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

        <View style={styles.buttonContainer}>
          <Button
            style={styles.buttonStyle}
            title="Update Account"
            onPress={() => this.props.navigation.navigate('Update Account')}
          />

          <Button
            style={styles.buttonStyle}
            title="Take a new account picture"
            onPress={() => this.props.navigation.navigate('Take a new picture')}
          />
        </View>
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

  buttonStyle: {
    width: 65,
    height: 65,
  },

  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

});

export default AccountScreen;