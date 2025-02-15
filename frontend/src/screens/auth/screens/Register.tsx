import React from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { AuthNavProps } from '../models/AuthParamList';
import * as firebase from 'firebase';
import { DismissKeyboardView } from '../../../components';

interface RegisterState {
    email: string | null;
    password: string | null;
    error: string | null;
    loading: boolean;
}

const initialState: RegisterState = {
    email: null,
    password: null,
    error: null,
    loading: false
};

enum ActionTypes {
    EmailChange,
    PasswordChange,
    Error,
    Success,
    Register
}

function loginReducer(
    state: RegisterState,
    action: { type: ActionTypes; payload: any }
) {
    switch (action.type) {
        case ActionTypes.EmailChange:
            return {
                ...state,
                email: action.payload
            };
        case ActionTypes.PasswordChange:
            return {
                ...state,
                password: action.payload
            };
        case ActionTypes.Register:
            return {
                ...state,
                loading: true
            };
        case ActionTypes.Success:
            return {
                ...state,
                loading: false
            };
        case ActionTypes.Error:
            return {
                ...state,
                error: action.payload,
                password: null,
                loading: false
            };
        default:
            return state;
    }
}

export function Register({ navigation }: AuthNavProps<'Register'>) {
    const [state, dispatch] = React.useReducer(loginReducer, initialState);

    const { email, password, error, loading } = state;

    const registerWithEmail = () => {
        dispatch({ type: ActionTypes.Register, payload: null });

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((data) => {
                data.user?.sendEmailVerification().then(() => {
                    console.log('send email');
                });
            })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    dispatch({
                        type: ActionTypes.Error,
                        payload: 'That email address is already in use!'
                    });
                } else if (error.code === 'auth/invalid-email') {
                    dispatch({
                        type: ActionTypes.Error,
                        payload: 'That email address is invalid!'
                    });
                } else {
                    dispatch({
                        type: ActionTypes.Error,
                        payload: error.message
                    });
                }
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
                    onChangeText={(email) =>
                        dispatch({
                            type: ActionTypes.EmailChange,
                            payload: email
                        })
                    }
                />

                <Input
                    containerStyle={styles.inputContainer}
                    label='Password'
                    labelStyle={styles.inputLabel}
                    autoCapitalize='none'
                    secureTextEntry
                    value={password}
                    onChangeText={(password) =>
                        dispatch({
                            type: ActionTypes.PasswordChange,
                            payload: password
                        })
                    }
                />

                <Button
                    loading={loading}
                    title='Sign Up'
                    onPress={registerWithEmail}
                />
            </View>
            <View>
                <Text
                    style={{
                        color: '#0088cc',
                        textAlign: 'center',
                        fontSize: 16
                    }}
                    onPress={() => Linking.openURL('https://t.me/AnteOfficial')}
                >
                    OUR TELEGRAM CHANNEL
                </Text>
            </View>
            <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account?</Text>
                <Button
                    type='clear'
                    title='Sign In'
                    titleStyle={{ fontSize: 16 }}
                    onPress={() => navigation.navigate('Login')}
                />
            </View>
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
        alignSelf: 'stretch',
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
    },
    signInContainer: {
        paddingTop: 20,
        marginTop: 'auto',
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    signInText: {
        color: 'gray',
        fontSize: 16
    }
});
