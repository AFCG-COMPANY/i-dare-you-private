import React from 'react';
import { Card, Text } from 'react-native-elements';
import { Challenge } from '../models';

interface ChallengeCardProps {
    challenge: Challenge;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
    return (
        <Card containerStyle={{ marginHorizontal: 0 }}>
            <Text>{challenge.title}</Text>
        </Card>
    );
};
