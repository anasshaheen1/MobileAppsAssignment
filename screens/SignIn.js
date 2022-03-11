import React, { Component, useState } from 'react';
import {
  Text, TextInput, View, Button, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@spacebook_details', jsonValue);
  } catch (e) {
    console.error(error);
  }
};

class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'cd@example.com',
      password: 'password1',
      incorrect_details: false,
    };
  }

  componentDidMount() {
    this.setState({ incorrect_details: false });
  }

  refresh = this.props.navigation.addListener('focus', () => {
    this.setState({ incorrect_details: false });
  });

  login = () => {
    fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        storeData(json);
        this.props.navigation.navigate('Home');
      })
      .catch((error) => {
        console.error(error);
        this.setState({ incorrect_details: true });
      });
  };

  render() {
    if (!this.state.incorrect_details) {
      return (
        <View style={styles.flexContainer}>

          <View style={styles.flexContainer}>

            <View>
              <Text>Email Address:</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Enter your email address"
                onChangeText={(email) => this.setState({ email })}
                value={this.state.email}
              />
            </View>

            <View>
              <Text>Password:</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Enter your password"
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
                secureTextEntry
              />
            </View>

          </View>

          <View style={styles.buttonContainer}>
            <Button
              style={styles.buttonStyle}
              title="Sign In"
              onPress={() => this.login()}
            />

            <Button
              style={styles.buttonStyle}
              title="Create Account"
              onPress={() => this.props.navigation.navigate('Create Account')}
            />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.flexContainer}>
        <View style={styles.flexContainer}>

          <View>
            <Text>Email Address:</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter your email address"
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
            />
          </View>

          <View>
            <Text>Password:</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter your password"
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
              secureTextEntry
            />
          </View>

          <Text>Incorrect or invalid Sign in details entered</Text>

        </View>

        <View style={styles.buttonContainer}>
          <Button
            style={styles.buttonStyle}
            title="Sign In"
            onPress={() => this.login()}
          />

          <Button
            style={styles.buttonStyle}
            title="Create Account"
            onPress={() => this.props.navigation.navigate('Create Account')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputStyle: {
    width: '60%',
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

  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },

  

  
});

export default SignInScreen;