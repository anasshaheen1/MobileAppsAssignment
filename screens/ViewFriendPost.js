import React, { Component } from 'react';
import {
  Text, View, Button, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (login, user_id, post) => {
  try {
    const jsonLogin = JSON.stringify(login);
    const jsonUser = JSON.stringify(user_id);
    const jsonPost = JSON.stringify(post);
    await AsyncStorage.setItem('@spacebook_details', jsonLogin);
    await AsyncStorage.setItem('@other_user_id', jsonUser);
    await AsyncStorage.setItem('@post', jsonPost);
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

const getPostID = async (done) => {
  try {
    const jsonValue = await AsyncStorage.getItem('@post_id');
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

class ViewFriendPostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login_info: {},
      isLoading: true,
      post: {},
      new_text: '',
      post_id: {},
      other_user_id: {},
    };
  }

  componentDidMount() {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: true,
        post: {},
        new_text: '',
        post_id: {},
        other_user_id: {},
      });

      getPostID((id) => {
        this.setState({
          post_id: id,
        });

        getOtherUser((user_id) => {
          this.setState({
            other_user_id: user_id,
          });

          this.getPost();
        });
      });
    });
  }

  refresh = this.props.navigation.addListener('focus', () => {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: true,
        post: {},
        new_text: '',
        post_id: {},
        other_user_id: {},
      });

      getPostID((id) => {
        this.setState({
          post_id: id,
        });

        getOtherUser((user_id) => {
          this.setState({
            other_user_id: user_id,
          });

          this.getPost();
        });
      });
    });
  });

  getPost = () => {
    console.log('Getting an existing post.....');
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.other_user_id}/post/${this.state.post_id}`, {
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
          post: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addLike = () => {
    console.log('Adding a like to an existing post.....');
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.other_user_id}/post/${this.state.post_id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.state.login_info.token,
      },
    })
      .then((response) => response.json())
      .then(this.getPost())
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

  removeLike = () => {
    console.log('Removing a like from an existing post.....');
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.other_user_id}/post/${this.state.post_id}/like`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.state.login_info.token,
      },
    })
      .then((response) => response.json())
      .then(this.getPost())
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

  updatePost = () => {
    storeData(this.state.login_info, this.state.other_user_id, this.state.post);
    this.props.navigation.navigate('Update Friend Post');
  };

  deletePost = () => {
    console.log('Deleting an existing post.....');
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.other_user_id}/post/${this.state.post.post_id}`, {
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
          isLoading: false,
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

        <View style={styles.flexContainer}>
          <Text>
            {this.state.post.author.first_name}
            {' '}
            {this.state.post.author.last_name}
          </Text>
          <Text>{this.state.post.timestamp}</Text>
          <Text>{this.state.post.text}</Text>
          <Text>
            Likes:
            {' '}
            {this.state.post.numLikes}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {this.state.post.author.user_id != this.state.login_info.id ? (
            <Button
              style={styles.buttonStyle}
              title="Like"
              onPress={() => {
                this.addLike();
                this.setState({ isLoading: true }, () => {
                  this.getPost();
                });
              }}
            />
          ) : null}

          {this.state.post.author.user_id != this.state.login_info.id ? (
            <Button
              style={styles.buttonStyle}
              title="Unlike"
              onPress={() => {
                this.removeLike();
                this.setState({ isLoading: true }, () => {
                  this.getPost();
                });
              }}
            />
          ) : null}

          {this.state.post.author.user_id == this.state.login_info.id ? (
            <Button
              style={styles.buttonStyle}
              title="Update"
              onPress={() => {
                this.setState({ isLoading: true }, () => {
                  this.updatePost();
                });
              }}
            />
          ) : null}

          {this.state.post.author.user_id == this.state.login_info.id ? (
            <Button
              style={styles.buttonStyle}
              title="Delete"
              onPress={() => {
                this.setState({ isLoading: true }, () => {
                  this.deletePost();
                  this.props.navigation.navigate("Friend's Home");
                });
              }}
            />
          ) : null}
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
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

  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  
});

export default ViewFriendPostScreen;