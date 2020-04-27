import React from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, View } from 'react-native';
import { Avatar, Badge, Button, Text } from 'react-native-elements';
import * as firebase from 'firebase';
import { getChallenges, getUserInfo } from '../../api';
import { Challenge, User } from '../../models';
import { ChallengeCard } from '../../components';
import { ProfileNavigationProp } from './ProfileStackNavigator';

const CHALLENGES_AMOUNT_PER_FETCH: number = 20;

interface ProfileProps {
    navigation: ProfileNavigationProp
}

export const Profile: React.FC<ProfileProps> = ({ navigation }) => {
    const [ loading, setLoading ] = React.useState<boolean>(true);
    const [ user, setUser ] = React.useState<User>()
    const [ challenges, setChallenges ] = React.useState<Challenge[]>([]);

    React.useEffect(() => {
        const userId = firebase.auth().currentUser?.uid;

        if (userId) {
            Promise.all([
                getUserInfo(userId),
                getChallenges(userId, 0, CHALLENGES_AMOUNT_PER_FETCH)
            ])
                .then(results => {
                    const [ userData, challenges ] = results;
                    setUser(userData);
                    setChallenges(challenges);
                })
                .catch(e => {
                    Alert.alert('Failed to load profile. Check Internet connection and try again.');
                    console.log(e);
                })
                .finally(() => setLoading(false));
        }
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator style={{alignSelf: 'center', flex: 1}} size='large' />
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Avatar
                        containerStyle={styles.avatarContainer}
                        rounded
                        size='large'
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

                <Text style={styles.username}>{user?.username}</Text>

                <FlatList
                    bounces={false}
                    data={challenges}
                    renderItem={({ item }) => (
                        <ChallengeCard
                            key={item.id}
                            challenge={item}
                        />
                    )}
                    ListHeaderComponent={() => <Text>{user?.bio}</Text>}
                    ListEmptyComponent={() => (
                        <View style={styles.challengesEmptyContainer}>
                            <Text>No challenges yet. </Text>
                            <Button
                                buttonStyle={styles.challengesEmptyButton}
                                type='clear'
                                title='Browse'
                                titleStyle={styles.text}
                                onPress={() => navigation.navigate('Feed')}
                            />
                            <Text> or </Text>
                            <Button
                                buttonStyle={styles.challengesEmptyButton}
                                type='clear'
                                title='create'
                                titleStyle={styles.text}
                                onPress={() => navigation.navigate('Challenge')}
                            />
                            <Text> new one</Text>
                        </View>
                    )}
                />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 40,
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    avatarContainer: {
        marginRight: 20
    },
    username: {
        marginVertical: 8,
        fontWeight: '700'
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
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    challengesEmptyButton: {
        padding: 0
    }
});
