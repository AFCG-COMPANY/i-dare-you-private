import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Login from './Login';
import Register from './Register';
import ResetPassword from './ResetPassword';

const AuthStack = createStackNavigator();
export const AuthStackScreen = () => (
    <AuthStack.Navigator>
        <AuthStack.Screen name='Login' component={Login} />
        <AuthStack.Screen name='Register' component={Register} />
        <AuthStack.Screen name='Reset Password' component={ResetPassword} />
    </AuthStack.Navigator>
);
