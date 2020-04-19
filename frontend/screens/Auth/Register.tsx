import React from 'react';
import * as firebase from 'firebase';
import { View, Text, TouchableOpacity } from 'react-native';

type Props = {
    route: any;
    navigation: any;
};

export default function Register({ navigation }: Props) {
    const registerWithEmail = (email: string, password: string) => {
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                console.log('User account created & signed in!');
                navigation.navigate('Feed');
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
    }

    return (
        <View>
            <TouchableOpacity onPress={() => registerWithEmail('nikita.marinosyan@gmail.com', 'superSecretPassword')}>
                <Text>Register</Text>
            </TouchableOpacity>
        </View>
    )
}
