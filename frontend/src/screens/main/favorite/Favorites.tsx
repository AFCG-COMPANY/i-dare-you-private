import React from 'react';
import { ChallengesList } from '../../../components';
import { Challenge, User } from '../../../models';
import { AppContext } from '../../../contexts/AppContext';
import { FavoriteNavigationProp } from './FavoriteStackNavigator';
import { View } from 'react-native';
import { Button, Text } from 'react-native-elements';

interface FeedProps {
    navigation: FavoriteNavigationProp;
}

export const Favorites: React.FC<FeedProps> = ({ navigation }) => {
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
            navigation.navigate('UserInfo', { user });
        }
    };

    return (
        <ChallengesList
            filterBy='likedBy'
            userId={state.user?.id}
            onProfilePress={navigateToProfile}
            onChallengePress={navigateToChallenge}
            onCommentPress={challenge => navigateToChallenge(challenge, true)}
            flatListProps={{
                style: { flex: 1, backgroundColor: '#ffffff' },
                ListEmptyComponent: (
                    <View style={{ margin: 10, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={{ alignSelf: 'center' }}>No bookmarks yet. </Text>
                        <Button
                            buttonStyle={{ padding: 0 }}
                            titleStyle={{ fontSize: 14 }}
                            type='clear'
                            title='Browse'
                            onPress={() => navigation.navigate('Feed')}
                        />
                        <Text> challenges.</Text>
                    </View>
                )
            }}
        />
    );
};
