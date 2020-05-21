import React from 'react';
import { FeedNavigationProp } from './FeedStackNavigator';
import { ChallengesList } from '../../../components';
import { Challenge } from '../../../models';

interface FeedProps {
    navigation: FeedNavigationProp;
}

export const Feed: React.FC<FeedProps> = ({ navigation }) => {
    const navigateToChallenge = (challenge: Challenge, commentPressed?: boolean) => {
        navigation.navigate('ChallengeInfo', {
            challenge,
            commentPressed
        });
    };

    return (
        <ChallengesList
            onProfilePress={user => navigation.navigate('UserInfo', { user })}
            onChallengePress={challenge => navigateToChallenge(challenge)}
            onCommentPress={challenge => navigateToChallenge(challenge, true)}
        />
    );
};
