import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-elements';
import { ChallengeStatus } from '../../../../../models/challenge';

interface ActionsProps {
    containerStyle?: StyleProp<ViewStyle>
    isParticipant: boolean;
    status: ChallengeStatus;
}
export const Actions: React.FC<ActionsProps> = ({
    containerStyle,
    status,
    isParticipant
}) => {
    let content;
    switch (status) {
        case ChallengeStatus.Created:
        case ChallengeStatus.InProgress:
            if (isParticipant) {
                content = <Text>You are already participating in this challenge.</Text>;
            } else {
                content = null;
            }
            break;

        case ChallengeStatus.Voting:
            return null;
            break;

        case ChallengeStatus.Finished:
            return null;
            break;

        default:
            console.log('Incorrect challenge status');
            return null;
    }

    return (
        <View style={containerStyle}>
            {content}
        </View>
    );
};
