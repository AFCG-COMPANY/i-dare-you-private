import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

export default function Login({ navigation }: any) {
    return (
        <View>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text>Register</Text>
            </TouchableOpacity>
        </View>
    )
}
