import React from 'react';
import { Button, Text, View } from 'react-native';
import { AuthNavProps } from '../models/AuthParamList';
import * as firebase from 'firebase';

export function Register({ navigation, route }: AuthNavProps<'Register'>) {
    const registerWithEmail = (email: string, password: string) => {
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
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
    }

    return (
        <View>
            <Text>{route.name}</Text>

            <Button
                title='Sign Up'
                onPress={() => registerWithEmail('nikita.marinosyan@gmail.com', 'SuperSecretPassword')}
            />

            <Button
                title='Back to Login'
                onPress={() => navigation.navigate('Login')}
            />
        </View>
    );
}
