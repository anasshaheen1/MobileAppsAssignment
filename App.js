import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/Home';
import CreateAccountScreen from './screens/CreateAccount';
import SignInScreen from './screens/SignIn';
import UpdateAccountScreen from './screens/UpdateAccount';
import NewPostScreen from './screens/NewPost';
import FriendsHomeScreen from './screens/FriendsHome';
import PostToFriendScreen from './screens/PostToFriend';
import UpdatePostScreen from './screens/UpdatePost';
import TakePictureScreen from './screens/TakePicture';
import OtherAccountScreen from './screens/otherAccount';
import ViewPostScreen from './screens/viewPost';
import ViewFriendPostScreen from './screens/viewFriendPost';
import UpdateFriendPostScreen from './screens/UpdateFriendPost';

const Stack = createNativeStackNavigator();

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Sign In" component={SignInScreen} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Create Account" component={CreateAccountScreen} />
          <Stack.Screen name="Update Account" component={UpdateAccountScreen} />
          <Stack.Screen name="New Post" component={NewPostScreen} />
          <Stack.Screen name="Friend's Home" component={FriendsHomeScreen} />
          <Stack.Screen name="Post to a Friend" component={PostToFriendScreen} title="New Post" />
          <Stack.Screen name="Update Post" component={UpdatePostScreen} />
          <Stack.Screen name="Take a new picture" component={TakePictureScreen} />
          <Stack.Screen name="User's Account" component={OtherAccountScreen} />
          <Stack.Screen name="Post" component={ViewPostScreen} />
          <Stack.Screen name="View Friend Post" component={ViewFriendPostScreen} title="Post" />
          <Stack.Screen name="Update Friend Post" component={UpdateFriendPostScreen} title="Update Post" />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
