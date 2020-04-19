import React from 'react';
import { Button, Text, View } from 'react-native';
import { AuthNavProps } from '../models/AuthParamList';

export function Login({ navigation, route }: AuthNavProps<'Login'>) {


    return (
        <View>
            <Text>{route.name}</Text>

            <Button
                title='Sign In'
                onPress={() => {
                    // TODO
                }}
            />

            <Button
                title='Register'
                onPress={() => navigation.navigate('Register')}
            />

            <Button
                title='Forgot password?'
                onPress={() => navigation.navigate('ResetPassword')}
            />
        </View>
    );
}
