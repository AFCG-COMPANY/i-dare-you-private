import React from 'react';
import { StyleSheet, Text } from 'react-native';
import * as firebase from 'firebase';
import { firebaseConfig } from './firebase.config';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import { ResetPasswordScreen } from './screens/ResetPasswordScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { HomeScreen } from './screens/HomeScreen';

const RootStack = createStackNavigator();

export default class App extends React.Component<any, any> {
    state: any = {
        loading: true,
        user: null
    };

    componentDidMount(): void {
        firebase.initializeApp(firebaseConfig);

        firebase.auth()
            .createUserWithEmailAndPassword('nikita.marinosyan@gmail.com', 'SuperSecretPassword!')
            .then(() => {
                console.log('User account created & signed in!');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }

                console.error(error);
            });

        firebase.auth().onAuthStateChanged(user => {
            this.setState({
                user: null,
                loading: false
            });
        });
    }

    render(): React.ReactNode {
        const { user, loading } = this.state;

        if (loading) {
            return <Text>Loading...</Text>;
        }

        return (
            <NavigationContainer>
                <RootStack.Navigator>
                    {
                        user ? (
                                <RootStack.Screen name="Home" component={HomeScreen}/>
                            )
                            : (
                                <>
                                    <RootStack.Screen name='Login' component={LoginScreen}/>
                                    <RootStack.Screen name='Register' component={RegisterScreen}/>
                                    <RootStack.Screen name='Reset Password' component={ResetPasswordScreen}/>
                                </>
                            )
                    }
                </RootStack.Navigator>
            </NavigationContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
