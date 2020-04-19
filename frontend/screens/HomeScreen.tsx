import React from 'react';
import { View, Text } from 'react-native';
import * as firebase from 'firebase';

export class HomeScreen extends React.Component {

    storeHighScore(userId: string, score: number) {
        firebase.database().ref('users/' + userId).set({
            highscore: score
        });
    }

    render(): React.ReactNode {
        return (
            <View>
                <Text>Home</Text>
            </View>
        )
    }
}
