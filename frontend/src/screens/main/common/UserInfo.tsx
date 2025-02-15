import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserProfile } from '../../../components';
import { AppContext } from '../../../contexts/AppContext';
import { Challenge, User } from '../../../models';

type ParentStackParamList = {
    UserInfo: { user: User },
    ChallengeInfo: { challenge: Challenge, commentPressed?: boolean }
};
type UserInfoRouteProp = RouteProp<ParentStackParamList, 'UserInfo'>;
type UserInfoNavigationProp = StackNavigationProp<ParentStackParamList, 'UserInfo'>;

interface UserInfoProps {
    route: UserInfoRouteProp,
    navigation: UserInfoNavigationProp;
}

export const UserInfo: React.FC<UserInfoProps> = ({ route, navigation }) => {
    const { state } = React.useContext(AppContext);

    const navigateToChallenge = (challenge: Challenge, commentPressed?: boolean) => {
        navigation.navigate('ChallengeInfo', {
            challenge,
            commentPressed
        });
    };

    const navigateToProfile = (user: User) => {
        if (user.id === state.user?.id) {
            navigation.navigate('Profile' as any);
        } else {
            navigation.push('UserInfo', { user });
        }
    };

    return (
        <UserProfile
            user={route.params.user}
            challengeListProps={{
                onProfilePress: navigateToProfile,
                onChallengePress: navigateToChallenge,
                onCommentPress: challenge => navigateToChallenge(challenge, true)
            }}
        />
    );
};
