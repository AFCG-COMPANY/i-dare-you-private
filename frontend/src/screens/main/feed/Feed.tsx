import React from 'react';
import { FeedNavigationProp } from './FeedStackNavigator';
import { ChallengesList } from '../../../components';
import { Challenge, User } from '../../../models';
import { AppContext } from '../../../contexts/AppContext';

interface FeedProps {
    navigation: FeedNavigationProp;
}

export const Feed: React.FC<FeedProps> = ({ navigation }) => {
    const { state } = React.useContext(AppContext);

    const navigateToChallenge = (challenge: Challenge, commentPressed?: boolean) => {
        navigation.navigate('ChallengeInfo', {
            challenge,
            commentPressed
        });
    };

    const navigateToProfile = (user: User) => {
        if (user.id === state.user?.id) {
            navigation.navigate('Profile');
        } else {
            navigation.push('UserInfo', { user });
        }
    };

    return (
        <ChallengesList
            onProfilePress={navigateToProfile}
            onChallengePress={navigateToChallenge}
            onCommentPress={challenge => navigateToChallenge(challenge, true)}
        />
    );
};
