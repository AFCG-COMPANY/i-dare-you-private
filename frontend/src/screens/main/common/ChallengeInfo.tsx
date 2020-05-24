import React from 'react';
import { Text } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Challenge } from '../../../models';

type ParentStackParamsList = {
    ChallengeInfo: { challenge: Challenge, commentPressed?: boolean };
};
type ChallengeInfoRouteProp = RouteProp<ParentStackParamsList, 'ChallengeInfo'>;
type ChallengeInfoNavigationProp = StackNavigationProp<ParentStackParamsList, 'ChallengeInfo'>;

interface ChallengeInfoProps {
    route: ChallengeInfoRouteProp,
    navigation: ChallengeInfoNavigationProp;
}

export const ChallengeInfo: React.FC<ChallengeInfoProps> = ({ route }) => {
    const { challenge, commentPressed } = route.params;

    return (
        <View style={styles.container}>
            <Text>Challenge Info</Text>
            <Text>{JSON.stringify(challenge)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 40
    }
});
