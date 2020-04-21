import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { AuthNavProps } from '../models/AuthParamList';
import * as firebase from 'firebase';

export function ResetPassword({
    navigation,
    route
}: AuthNavProps<'ResetPassword'>) {
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState(null);

    const resetEmail: (email: string) => void = (email: string) => {
        firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(function () {
                alert(
                    'Мы отправили письмо вам на почту, можете поменять пароль.'
                );
                navigation.navigate('Login');
            })
            .catch(function () {
                alert(
                    'Проверьте интернет, введенные данные и попробуйте еще раз.'
                );
            });
    };

    return (
        <View style={styles.container}>
            {error && <Text style={styles.errorMessage}>{error}</Text>}

            <View style={styles.form}>
                <Input
                    containerStyle={styles.inputContainer}
                    label="Email Address"
                    labelStyle={styles.inputLabel}
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(email: string) => setEmail(email)}
                />
            </View>

            <Button
                style={styles.button}
                title="Reset password"
                onPress={() => resetEmail(email)}
            />

            <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account?</Text>
                <Button
                    type="clear"
                    title="Sign Up"
                    onPress={() => navigation.navigate('Register')}
                />
            </View>

            <Button
                type="clear"
                title="Login"
                onPress={() => navigation.navigate('Login')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 40,
        flex: 1,
        backgroundColor: '#fff'
    },
    errorMessage: {
        marginBottom: 20,
        alignSelf: 'center',
        color: 'tomato',
        fontSize: 16
    },
    form: {
        marginVertical: 20
    },
    inputContainer: {
        marginBottom: 20
    },
    inputLabel: {
        textTransform: 'uppercase'
    },
    button: {},
    signUpContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    signUpText: {
        fontSize: 16
    },
    signUpButton: {}
});
