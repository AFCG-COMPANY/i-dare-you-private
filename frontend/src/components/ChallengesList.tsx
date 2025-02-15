import React from 'react';
import { ActivityIndicator, Alert, FlatList, View } from 'react-native';
import { Challenge, User } from '../models';
import { getChallenges, setLikedChallenge } from '../api/challenge';
import { ChallengeCard } from './ChallengeCard/ChallengeCard';
import { Button, Divider, Text } from 'react-native-elements';
import { ChallengeToolbar } from './ChallengeToolbar';
import { AppActionTypes, AppContext } from '../contexts/AppContext';
import { ChallengeStatus } from '../models/challenge';

export interface ChallengesListProps {
    flatListProps?: any;
    filterBy?: 'participant' | 'likedBy';
    userId?: string;
    onProfilePress?: (user: User) => void;
    onChallengePress?: (challenge: Challenge) => void;
    onCommentPress?: (challenge: Challenge) => void;
}

interface ChallengesListState {
    loading: boolean;
    challenges: Challenge[];
    page: number;
    fetchedAll: boolean;
    refreshing: boolean;
    challengeIdToIndexMap: {[challengeId: string]: number};
}

export class ChallengesList extends React.Component<ChallengesListProps, ChallengesListState> {
    static contextType = AppContext;

    state: ChallengesListState = {
        loading: false,
        challenges: [],
        page: 0,
        fetchedAll: false,
        refreshing: false,
        challengeIdToIndexMap: {}
    };

    componentDidMount = () => this.fetchData();

    componentDidUpdate(prevProps: Readonly<ChallengesListProps>, prevState: Readonly<ChallengesListState>, snapshot?: any) {
        const challenge = this.context.state.challenge as Challenge;
        if (challenge) {
            const index = this.state.challengeIdToIndexMap[challenge.id];
            this.state.challenges[index] = challenge;
            this.setState({
                challenges: [...this.state.challenges]
            }, () => this.context.dispatch({ type: AppActionTypes.SetChallenge, payload: null }));
        }
    }

    fetchData = async () => {
        this.setState({ loading: true });

        const { filterBy, userId } = this.props;

        try {
            let challenges = await getChallenges(this.context.state.user.id, this.state.page, filterBy, userId);
            const fetchedAll = !challenges || !challenges.length;

            this.setState(state => {
                let challengeIdToIndexMap: {[key: string]: number};
                if (state.refreshing) {
                    challengeIdToIndexMap = {};
                    challenges = challenges.map((challenge, index) => {
                        challengeIdToIndexMap[challenge.id] = index;
                        return { ...challenge, likesCount: challenge.likedBy.length };
                    });
                } else {
                    challengeIdToIndexMap = state.challengeIdToIndexMap;
                    challenges = challenges.map((challenge, index) => {
                        challengeIdToIndexMap[challenge.id] = state.challenges.length + index;
                        return { ...challenge, likesCount: challenge.likedBy.length };
                    });
                    challenges = [...state.challenges, ...challenges];
                }

                return {
                    challenges,
                    challengeIdToIndexMap,
                    loading: false,
                    fetchedAll,
                    refreshing: false
                };
            });
        } catch (e) {
            console.log(e);
            this.setState(state => ({
                loading: false,
                refreshing: false,
                fetchedAll: true,
                page: state.page > 0 ? state.page - 1 : 0
            }));
        }
    };

    onScrollEnd = () => {
        this.setState(
            state => ({ page: state.page + 1 }),
            () => this.fetchData()
        );
    };

    handleRefresh = () => {
        this.setState(
            { page: 0, refreshing: true },
            () => this.fetchData()
        );
    };

    renderListFooter = () => {
        return this.state.loading && !this.state.refreshing
            ? <ActivityIndicator style={{ marginTop: 20 }} size='large'/>
            : null;
    };

    toggleLike = (challenge: Challenge) => {
        challenge.likedByUser = !challenge.likedByUser;
        challenge.likedByUser ? ++challenge.likesCount : --challenge.likesCount;

        this.setState(
            { challenges: [...this.state.challenges] },
            () => {
                setLikedChallenge(challenge.id, this.context.state.user.id, challenge.likedByUser)
                    .then(() => console.log('successfully set like on challenge'))
                    .catch((e: Error) => {
                        console.log(e);
                        Alert.alert('Failed to set like on this challenge. Please, try again later.');

                        challenge.likedByUser = !challenge.likedByUser;
                        challenge.likedByUser ? ++challenge.likesCount : --challenge.likesCount;
                        this.setState({ challenges: [...this.state.challenges] });
                    });
            }
        );
    }

    renderVoteSection = (challenge: Challenge) => {
        if (challenge.status === ChallengeStatus.Voting
            && (challenge.isOpponent || challenge.createdBy.id === this.context.state.user.id)
        ) {
            return (<>
                <Divider style={{ marginVertical: 16 }}/>
                {challenge.userVote != null
                    ? (
                        <Text>You voted for:
                            <Text style={{ fontWeight: '600' }}>{challenge.userVote ? 'Goal Achieved' : 'Goal not Reached'}</Text>
                        </Text>
                    )
                    : (
                        <Button
                            title='Vote'
                            onPress={() => this.props.onChallengePress && this.props.onChallengePress(challenge)}
                        />
                    )
                }
            </>);
        }
    };

    render() {
        const { ListEmptyComponent, ...flatListProps } = this.props.flatListProps || {};

        return (
            <>
                <FlatList
                    {...flatListProps}
                    data={this.state.challenges}
                    keyExtractor={item => item.id}
                    renderItem={({ item }: { item: Challenge }) => (
                        <View style={{ marginBottom: 8 }}>
                            <ChallengeCard
                                challenge={item}
                                onChallengePress={() => this.props.onChallengePress && this.props.onChallengePress(item)}
                                onProfilePress={this.props.onProfilePress}
                            >
                                {this.renderVoteSection(item)}
                                <Divider style={{ marginVertical: 16 }} />

                                <ChallengeToolbar
                                    liked={item.likedByUser}
                                    likesCount={item.likesCount}
                                    commentsCount={item.commentsCount}
                                    onCommentPress={() => this.props.onCommentPress && this.props.onCommentPress(item)}
                                    onLikePress={() => this.toggleLike(item)}
                                />
                            </ChallengeCard>
                        </View>
                    )}
                    ListFooterComponent={this.renderListFooter}
                    ListEmptyComponent={this.state.fetchedAll && ListEmptyComponent}
                    onEndReachedThreshold={0.3}
                    onEndReached={!this.state.loading && !this.state.fetchedAll && this.onScrollEnd}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                />
            </>
        );
    }
}
