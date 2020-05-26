import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge, Button, Text } from 'react-native-elements';
import { User } from '../models';
import { Avatar } from './Avatar';
import { ChallengesList, ChallengesListProps } from './ChallengesList';

interface UserProfileProps {
    user: User | null,
    isCurrentUser?: boolean;
    onCreateNewChallengePress?: () => void;
    onBrowseChallengesPress?: () => void;
    challengeListProps?: ChallengesListProps
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, isCurrentUser, ...props }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Avatar
                    containerStyle={styles.avatarContainer}
                    source={{ uri: isCurrentUser ? user?.avatarBase64 : user?.avatar }}
                />

                <View style={styles.stats}>
                    <View style={styles.statsItem}>
                        <Badge
                            badgeStyle={styles.statsBadge}
                            textStyle={styles.text}
                            value={user?.wins || 0}
                            status='success'
                        />
                        <Text style={styles.text}>Wins</Text>
                    </View>

                    <View style={styles.statsItem}>
                        <Badge
                            badgeStyle={styles.statsBadge}
                            textStyle={styles.text}
                            value={user?.draws || 0}
                        />
                        <Text style={styles.text}>Draws</Text>
                    </View>

                    <View style={styles.statsItem}>
                        <Badge
                            badgeStyle={styles.statsBadge}
                            textStyle={styles.text}
                            value={user?.losses || 0}
                            status='error'
                        />
                        <Text style={styles.text}>Losses</Text>
                    </View>
                </View>
            </View>

            <ChallengesList
                filterBy='participant'
                userId={user?.id}
                flatListProps={{
                    ListHeaderComponent: <Text style={{ marginBottom: 16 }}>{user?.bio}</Text>,
                    ListEmptyComponent: <ChallengesEmptyComponent isCurrentUser={isCurrentUser} {...props} />
                }}
                {...props.challengeListProps}
            />
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
