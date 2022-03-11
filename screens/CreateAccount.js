import React, { Component, useState } from 'react';
import {
  Text, TextInput, View, Button, StyleSheet,
} from 'react-native';

class CreateAccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: 'Emma',
      last_name: 'Smith',
      email: 'emma.smith@example.com',
      password: 'user1123',
      bad_details: false,
    };
  }

  componentDidMount() {
    this.setState({ bad_details: false });
  }

  refresh = this.props.navigation.addListener('focus', () => {
    this.setState({ bad_details: false });
  });

  signup = () => {
    fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        this.props.navigation.navigate('Sign In');
      })
      .catch((error) => {
        console.error(error);
        this.setState({ bad_details: true });
      });
  };

  render() {
    if (!this.state.bad_details) {
      return (
        <View style={styles.flexContainer}>

          <View>
            <Text>First Name:</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter your first name"
              onChangeText={(first_name) => this.setState({ first_name })}
              value={this.state.first_name}
            />
          </View>

          <View>
            <Text>Last Name:</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter your last name"
              onChangeText={(last_name) => this.setState({ last_name })}
              value={this.state.last_name}
            />
          </View>

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

          <Button
            style={styles.buttonStyle}
            title="Create Account"
            onPress={() => this.signup()}
          />
        </View>
      );
    }

    return (
      <View style={styles.flexContainer}>

        <View>
          <Text>First Name:</Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="Enter your first name"
            onChangeText={(first_name) => this.setState({ first_name })}
            value={this.state.first_name}
          />
        </View>

        <View>
          <Text>Last Name:</Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="Enter your last name"
            onChangeText={(last_name) => this.setState({ last_name })}
            value={this.state.last_name}
          />
        </View>

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

        <Text>The details entered are incorrect or invalid </Text>

        <Button
          style={styles.buttonStyle}
          title="Create Account"
          onPress={() => this.createaccount()}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputStyle: {
    width: '95%',
  },

  buttonStyle: {
    width: 65,
    height: 65,
    alignItems: 'flex-start',

  },

  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  
});

export default CreateAccountScreen;