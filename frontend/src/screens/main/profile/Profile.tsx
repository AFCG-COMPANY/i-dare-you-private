import React from 'react';
import { UserProfile } from '../../../components';
import { ProfileNavigationProp } from './ProfileStackNavigator';
import { AppContext } from '../../../contexts/AppContext';
import { Challenge, User } from '../../../models';

interface ProfileProps {
    navigation: ProfileNavigationProp;
}

export const Profile: React.FC<ProfileProps> = ({ navigation }) => {
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
        <UserProfile
            user={state.user}
            isCurrentUser={true}
            onBrowseChallengesPress={() => navigation.navigate('Feed')}
            onCreateNewChallengePress={() => navigation.navigate('CreateChallenge')}
            challengeListProps={{
                onProfilePress: navigateToProfile,
                onChallengePress: navigateToChallenge,
                onCommentPress: challenge => navigateToChallenge(challenge, true)
            }}
        />
    );
};
