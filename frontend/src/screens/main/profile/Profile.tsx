import React from 'react';
import { UserProfile } from '../../../components';
import { ProfileNavigationProp } from './ProfileStackNavigator';
import { AppContext } from '../../../contexts/AppContext';

interface ProfileProps {
    navigation: ProfileNavigationProp;
}

export const Profile: React.FC<ProfileProps> = ({ navigation }) => {
    const { state } = React.useContext(AppContext);
    const { user } = state;

    return (
        <UserProfile
            user={user}
            isCurrentUser={true}
            onBrowseChallengesPress={() => navigation.navigate('Feed')}
            onCreateNewChallengePress={() => navigation.navigate('CreateChallenge')}
        />
    );
};
