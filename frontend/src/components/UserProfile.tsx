import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { Badge, Button, Text } from 'react-native-elements';
import { Challenge, User } from '../models';
import { getChallenges } from '../api/api';
import { Avatar } from './Avatar';
import { ChallengeCard } from './ChallengeCard';

const CHALLENGES_AMOUNT_PER_FETCH: number = 20;

interface UserProfileProps {
    user: User | null,
    isCurrentUser?: boolean;
    onCreateNewChallengePress?: () => void;
    onBrowseChallengesPress?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, isCurrentUser, ...props }) => {
    const [challenges, setChallenges] = React.useState<Challenge[] | undefined>();

    React.useEffect(() => {
        let mounted = true;
        const userId = user?.id;

        if (userId) {
            getChallenges(userId, 0, CHALLENGES_AMOUNT_PER_FETCH)
                .then((res) => mounted && setChallenges(res))
                .catch(e => {
                    if (mounted) {
                        setChallenges([]);
                        console.log(e);
                    }
                });
        } else {
            setChallenges([]);
        }

        return () => {
            mounted = false;
        };
    }, [user]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Avatar
                    containerStyle={styles.avatarContainer}
                    source={{ uri: user?.avatar }}
                />

                <View style={styles.stats}>
                    <View style={styles.statsItem}>
                        <Badge
                            badgeStyle={styles.statsBadge}
                            textStyle={styles.text}
                            value={0}
                            status='success'
                        />
                        <Text style={styles.text}>Wins</Text>
                    </View>

                    <View style={styles.statsItem}>
                        <Badge
                            badgeStyle={styles.statsBadge}
                            textStyle={styles.text}
                            value={0}
                        />
                        <Text style={styles.text}>Draws</Text>
                    </View>

                    <View style={styles.statsItem}>
                        <Badge
                            badgeStyle={styles.statsBadge}
                            textStyle={styles.text}
                            value={0}
                            status='error'
                        />
                        <Text style={styles.text}>Losses</Text>
                    </View>
                </View>
            </View>

            {challenges ? (
                <FlatList
                    bounces={false}
                    data={challenges}
                    renderItem={({ item }) => (
                        <ChallengeCard key={item.id} challenge={item} />
                    )}
                    ListHeaderComponent={<Text>{user?.bio}</Text>}
                    ListEmptyComponent={
                        <ChallengesEmptyComponent isCurrentUser={isCurrentUser} {...props} />
                    }
                />
            ) : (
                <>
                    <Text>{user?.bio}</Text>
                    <ActivityIndicator
                        style={{ alignSelf: 'center', flex: 1 }}
                        size='large'
                    />
                </>
            )}
        </View>
    );
};

interface ChallengesEmptyComponentProps {
    isCurrentUser?: boolean;
    onCreateNewChallengePress?: () => void;
    onBrowseChallengesPress?: () => void;
}

const ChallengesEmptyComponent: React.FC<ChallengesEmptyComponentProps> = (props) => (
    <View style={styles.challengesEmptyContainer}>
        <Text>No challenges yet. </Text>
        {
            props.isCurrentUser
            &&
            <>
                <Button
                    buttonStyle={styles.challengesEmptyButton}
                    type='clear'
                    title='Browse'
                    titleStyle={styles.text}
                    onPress={props.onBrowseChallengesPress}
                />
                <Text> or </Text>
                <Button
                    buttonStyle={styles.challengesEmptyButton}
                    type='clear'
                    title='create'
                    titleStyle={styles.text}
                    onPress={props.onCreateNewChallengePress}
                />
                <Text> new one</Text>
            </>
        }
    </View>
);

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 40,
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        marginBottom: 18,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    avatarContainer: {
        marginRight: 20
    },
    stats: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between'
    },
    statsItem: {
        marginRight: 8,
        display: 'flex',
        alignItems: 'center'
    },
    statsBadge: {
        height: 20
    },
    text: {
        fontSize: 14
    },
    challengesEmptyContainer: {
        marginTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    challengesEmptyButton: {
        padding: 0
    }
});
