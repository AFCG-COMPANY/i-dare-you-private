import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';

interface ProfileProps {
}

export const Profile: React.FC<ProfileProps> = ({}) => {
    return (
        <SafeAreaView>
            <Text>Profile</Text>

            <Button
                title='Sign Out'
                onPress={() => {
                    firebase.auth().signOut();
                }}
            />
        </SafeAreaView>
    )
}
