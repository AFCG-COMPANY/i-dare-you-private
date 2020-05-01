import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { AuthNavProps } from '../models/AuthParamList';
import * as firebase from 'firebase';
import { DismissKeyboardView } from '../../../components';

export function ResetPassword({ navigation }: AuthNavProps<'ResetPassword'>) {
    const [email, setEmail] = React.useState<string>('');
    const [error, setError] = React.useState<string | null>(null);

    const resetEmail: (email: string) => void = (email: string) => {
        firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(function () {
                alert('Check your email to reset password.');
                navigation.navigate('Login');
            })
            .catch(() => {
                setError('Invalid credentials.');
            });
    };

    return (
        <DismissKeyboardView style={styles.container}>
            <View style={styles.form}>
                {error && <Text style={styles.errorMessage}>{error}</Text>}

                <Input
                    containerStyle={styles.inputContainer}
                    label='Email Address'
                    labelStyle={styles.inputLabel}
                    autoCapitalize='none'
                    value={email}
                    onChangeText={email => setEmail(email)}
                />

                <Button
                    title='Reset password'
                    onPress={() => resetEmail(email)}
                />
            </View>

            <Button
                type='clear'
                title='Back to Login'
                titleStyle={{ fontSize: 16 }}
                onPress={() => navigation.navigate('Login')}
            />
        </DismissKeyboardView>
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
        marginVertical: 20,
        flex: 1,
        justifyContent: 'center'
    },
    inputContainer: {
        marginBottom: 20,
        paddingHorizontal: 0
    },
    inputLabel: {
        textTransform: 'uppercase'
    }
});
