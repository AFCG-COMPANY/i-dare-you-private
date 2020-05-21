import React from 'react';
import { FeedNavigationProp } from './FeedStackNavigator';
import { ChallengesList } from '../../../components';

interface FeedProps {
    navigation: FeedNavigationProp;
}

export const Feed: React.FC<FeedProps> = ({ navigation }) => {
    return (
        <ChallengesList
            onProfilePress={user => navigation.navigate('UserInfo', { user })}
            onChallengePress={challenge => navigation.navigate('ChallengeInfo', { challenge })}
        />
    );
};
