import React from 'react';
import { Text, View } from 'react-native';
import { AuthNavProps } from '../models/AuthParamList';

export function ResetPassword({ navigation, route }: AuthNavProps<'ResetPassword'>) {
    return (
        <View>
            <Text>{route.name}</Text>
        </View>
    );
}
