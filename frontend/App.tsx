import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import { firebaseConfig } from './firebase.config';

export default class App extends React.Component<any, any> {
    state: any = {
        loading: true,
        user: null
    }

    storeHighScore(userId: string, score: number) {
        firebase.database().ref('users/' + userId).set({
            highscore: score
        });
    }

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
                user,
                loading: false
            })
        });
    }

    componentWillUnmount(): void {

    }

    render(): React.ReactNode {
        return (
            <View style={{ padding: 40 }}>
                {this.state.loading && <Text>Loading</Text>}

                {
                    this.state.user
                        ? <Text>{this?.state?.user?.email}</Text>
                        : <Text>You are not authorized</Text>
                }

                <TouchableOpacity onPress={() => this.storeHighScore('n', 100)}>
                    <Text>Hello</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
