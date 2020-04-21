import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthParamList } from './models/AuthParamList';
import { Login } from './screens/Login';
import { ResetPassword } from './screens/ResetPassword';
import { Register } from './screens/Register';

const Stack = createStackNavigator<AuthParamList>();

export function AuthNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                options={{ headerTitle: 'Sign In' }}
                component={Login}
            />

            <Stack.Screen
                name="ResetPassword"
                options={{ headerTitle: 'Reset Password' }}
                component={ResetPassword}
            />

            <Stack.Screen
                name="Register"
                options={{ headerTitle: 'Sign Up', headerLeft: () => null }}
                component={Register}
            />
        </Stack.Navigator>
    );
}
