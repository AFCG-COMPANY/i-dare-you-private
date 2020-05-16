import React from 'react';
import { Card, Text } from 'react-native-elements';
import { Challenge } from '../models';
import { getFormattedDateString } from '../helpers/date.helper';

interface ChallengeCardProps {
    challenge: Challenge;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
    return (
        <Card containerStyle={{ marginHorizontal: 0 }}>
            <Text>{challenge.description}</Text>
            <Text>{challenge.bid}</Text>
            <Text>{getFormattedDateString(new Date(challenge.endDate))}</Text>
        </Card>
    );
};
