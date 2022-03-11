import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, StyleSheet,
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

class NewPostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login_info: {},
      isLoading: true,
      post_text: '',
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

  newPost = () => {
    console.log('Creating a new post.....');
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.login_info.id}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.state.login_info.token,
      },
      body: JSON.stringify({
        text: this.state.post_text,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          info: responseJson,
        });
        this.props.navigation.navigate('Home');
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

        <TextInput
          style={styles.inputStyle}
          placeholder="Type your new post here....."
          onChangeText={(post_text) => this.setState({ post_text })}
          value={this.state.post_text}
          multiline
        />

        <Button
          style={styles.buttonStyle}
          title="Add a new post"
          onPress={() => this.newPost()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputStyle: {
    width: '95%',
    height: '65%',
    alignSelf: 'flex-start',
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

export default NewPostScreen;