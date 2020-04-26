import React from 'react';
import { View, Text } from 'react-native';
import * as firebase from 'firebase';
import { Button } from 'react-native-elements';

interface SettingsProps {}

export const Settings: React.FC<SettingsProps> = ({}) => {
    return (
        <View>
            <Text>Settings</Text>

            <Button
                title='Sign Out'
                onPress={() => firebase.auth().signOut()}
            />
        </View>
    )
};
