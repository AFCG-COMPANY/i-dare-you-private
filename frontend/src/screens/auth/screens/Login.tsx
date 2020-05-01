import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import * as firebase from 'firebase';
import { AuthNavProps } from '../models/AuthParamList';
import { DismissKeyboardView } from '../../../components';

interface LoginState {
    email: string | null;
    password: string | null;
    error: string | null;
    loading: boolean;
}

const initialState: LoginState = {
    email: null,
    password: null,
    error: null,
    loading: false
};

enum ActionTypes {
    EmailChange,
    PasswordChange,
    Error,
    Login
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
        case ActionTypes.Login:
            return { ...state, loading: true };
        case ActionTypes.Error:
            return {
                ...state,
                error: action.payload,
                loading: false,
                password: null
            };
        default:
            return state;
    }
}

export function Login({ navigation }: AuthNavProps<'Login'>) {
    const [state, dispatch] = React.useReducer(loginReducer, initialState);

    const { email, password, error, loading } = state;

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
                    containerStyle={styles.signInButtonContainer}
                    title='Sign In'
                    loading={loading}
                    onPress={() => {
                        dispatch({ type: ActionTypes.Login, payload: null });

                        firebase
                            .auth()
                            .signInWithEmailAndPassword(email, password)
                            .catch((error) =>
                                dispatch({
                                    type: ActionTypes.Error,
                                    payload: error.message
                                })
                            );
                    }}
                />

                <Button
                    containerStyle={{ alignSelf: 'flex-end' }}
                    type='clear'
                    title='Forgot password?'
                    titleStyle={{ fontSize: 16 }}
                    onPress={() => navigation.navigate('ResetPassword')}
                />
            </View>

            <View style={styles.signInContainer}>
                <Text style={styles.signInText}>New to I Dare You?</Text>
                <Button
                    type='clear'
                    title='Sign Up'
                    titleStyle={{ fontSize: 16 }}
                    onPress={() => navigation.navigate('Register')}
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
    },
    signInButtonContainer: {},
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
