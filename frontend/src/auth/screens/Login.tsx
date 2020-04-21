import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import * as firebase from 'firebase';
import { AuthNavProps } from '../models/AuthParamList';

interface LoginState {
    email: string | null;
    password: string | null;
    error: string | null;
}

const initialState: LoginState = {
    email: null,
    password: null,
    error: null
};

enum ActionTypes {
    EmailChange,
    PasswordChange,
    Error,
    Success
}

function loginReducer(
    state: LoginState,
    action: { type: ActionTypes; payload: any }
) {
    switch (action.type) {
        case ActionTypes.EmailChange:
            return { ...state, email: action.payload };
        case ActionTypes.PasswordChange:
            return { ...state, password: action.payload };
        case ActionTypes.Success:
            return { ...initialState };
        case ActionTypes.Error:
            return {
                ...state,
                error: action.payload,
                password: null
            };
        default:
            return state;
    }
}

export function Login({ navigation }: AuthNavProps<'Login'>) {
    const [state, dispatch] = React.useReducer(loginReducer, initialState);

    const { email, password, error } = state;

    return (
        <View style={styles.container}>
            {error && <Text style={styles.errorMessage}>{error}</Text>}

            <View style={styles.form}>
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
            </View>

            <Button
                style={styles.button}
                title='Sign In'
                onPress={() => {
                    firebase
                        .auth()
                        .signInWithEmailAndPassword(email, password)
                        .then(() =>
                            dispatch({
                                type: ActionTypes.Success,
                                payload: null
                            })
                        )
                        .catch((error) =>
                            dispatch({
                                type: ActionTypes.Error,
                                payload: error.message
                            })
                        );
                }}
            />

            <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account?</Text>
                <Button
                    type='clear'
                    title='Sign Up'
                    onPress={() => navigation.navigate('Register')}
                />
            </View>

            <Button
                type='clear'
                title='Forgot password?'
                onPress={() => navigation.navigate('ResetPassword')}
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
