import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';
import { Camera } from 'expo-camera';
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

class TakePictureScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login_info: {},
      isLoading: true,
      hasPermission: null,
      type: Camera.Constants.Type.back,
    };
  }

  async componentDidMount() {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: false,
      });
    });
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
  }

  sendToServer = async (data) => {
    const res = await fetch(data.base64);
    const blob = await res.blob();

    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.login_info.id}/photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': this.state.login_info.token,
      },
      body: blob,
    })
      .then((response) => {
        console.log('Picture added', response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendToServer(data),
      };
      await this.camera.takePictureAsync(options);
    }
  };

  render() {
    if (this.state.hasPermission) {
      return (
        <View style={styles.container}>
          <Camera
            style={styles.camera}
            type={this.state.type}
            ref={(ref) => this.camera = ref}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.takePicture();
                }}
              >
                <Text style={styles.text}> Take Photo </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  const type = type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back;

                  this.setState({ type });
                }}
              >
                <Text style={styles.text}> Flip </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
    return (
      <Text>There is no access to the device's camera</Text>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 0.1,
    alignSelf: 'center',
    alignItems: 'flex-start',
  },

  text: {
    fontSize: 20,
    color: 'blue',
  },

  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  camera: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

});

export default TakePictureScreen;