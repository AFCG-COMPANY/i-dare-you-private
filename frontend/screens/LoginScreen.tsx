import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
    route: any;
    navigation: any;
};

export default function LoginScreen({ navigation }: Props) {
    return (
        <View>
            <Text>Login content</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Reset Password')}>
                <Text>Reset Password</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text>Register</Text>
            </TouchableOpacity>
        </View>
    )
}
