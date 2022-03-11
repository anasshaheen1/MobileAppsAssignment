import React, { Component } from 'react';
import {
  Text, View, Button, StyleSheet, ScrollView, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (login, post, post_id) => {
  try {
    const jsonLogin = JSON.stringify(login);
    const jsonPost = JSON.stringify(post);
    const jsonPostID = JSON.stringify(post_id);
    await AsyncStorage.setItem('@spacebook_details', jsonLogin);
    await AsyncStorage.setItem('@post', jsonPost);
    await AsyncStorage.setItem('@post_id', jsonPostID);
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

class WallScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login_info: {},
      isLoading: true,
      to_be_edited: {},
      feed: {},
    };
  }

  componentDidMount() {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: true,
        feed: {},
      });

      this.getWall();
    });
  }

  refresh = this.props.navigation.addListener('focus', () => {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: true,
        feed: {},
      });

      this.getWall();
    });
  });

  getWall = () => {
    console.log('Getting wall.....');
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.login_info.id}/post`, {
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
          feed: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  deletePost = (post_id) => {
    console.log('Deleting an existing post.....');
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.login_info.id}/post/${post_id}`, {
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

  updatePost = () => {
    storeData(this.state.login_info, this.state.to_be_edited, this.state.to_be_edited.post_id);
    this.props.navigation.navigate('Update Post');
  };

  viewPost = () => {
    storeData(this.state.login_info, this.state.to_be_edited, this.state.to_be_edited.post_id);
    this.props.navigation.navigate('Post');
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

          <Button
            style={styles.buttonStyle}
            title="Add a new post to my wall"
            onPress={() => this.props.navigation.navigate('New Post')}
          />

          <View style={styles.flexContainer}>
            <FlatList
              data={this.state.feed}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text>
                    {item.author.first_name}
                    {' '}
                    {item.author.last_name}
                    :
                  </Text>
                  <Text>{item.text}</Text>
                  <Text>
                    Likes:
                    {' '}
                    {item.numLikes}
                  </Text>

                  <View style={styles.buttonContainer}>
                    <Button
                      style={styles.buttonStyle}
                      title="View"
                      onPress={() => {
                        this.setState({ to_be_edited: item }, () => {
                          this.viewPost();
                        });
                      }}
                    />

                    {item.author.user_id == this.state.login_info.id ? (
                      <Button
                        style={styles.buttonStyle}
                        title="Update"
                        onPress={() => {
                          this.setState({ to_be_edited: item, isLoading: true }, () => {
                            this.updatePost();
                          });
                        }}
                      />
                    ) : null}

                    {item.author.user_id == this.state.login_info.id ? (
                      <Button
                        style={styles.buttonStyle}
                        title="Delete"
                        onPress={() => {
                          this.deletePost(item.post_id);
                          this.setState({ feed: {}, isLoading: true }, () => {
                            this.getWall();
                          });
                        }}
                      />
                    ) : null}

                  </View>

                </View>
              )}
              keyExtractor={(item, index) => item.post_id}
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

  headerStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonStyle: {
    width: 65,
    height: 65,
    alignItems: 'flex-start',

  },

  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  outerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },  

});

export default WallScreen;