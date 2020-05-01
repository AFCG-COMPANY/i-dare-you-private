import React from 'react';
import { ScrollView } from 'react-native';
import { FeedNavigationProp } from './FeedStackNavigator';
import { ChallengeCard } from '../../../components';
import { Challenge } from '../../../models';

interface FeedProps {
    navigation: FeedNavigationProp;
}

const challenges: Challenge[] = [];

for (let i = 1; i < 20; i++) {
    challenges.push({ id: i.toString(), title: `Challenge #${i}` });
}

export const Feed: React.FC<FeedProps> = ({ navigation }) => {
    return (
        <ScrollView>
            {challenges.map(item => <ChallengeCard key={item.id} challenge={item} />)}
        </ScrollView>
    );
};
