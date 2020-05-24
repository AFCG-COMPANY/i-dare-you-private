import React from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { Challenge, User } from '../models';
import { getChallenges } from '../api/challenge';
import { ChallengeCard } from './ChallengeCard/ChallengeCard';
import { AppContext } from '../contexts/AppContext';
import { Divider } from 'react-native-elements';
import { ChallengeToolbar } from './ChallengeToolbar';

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
}

export class ChallengesList extends React.Component<ChallengesListProps, ChallengesListState> {
    static contextType = AppContext;

    state = {
        loading: false,
        challenges: [],
        page: 0,
        fetchedAll: false,
        refreshing: false
    };

    componentDidMount = () => this.fetchData();

    fetchData = async () => {
        this.setState({ loading: true });

        const { filterBy, userId } = this.props;

        try {
            const challenges = await getChallenges(this.state.page, filterBy, userId);

            this.setState(state => ({
                challenges: state.refreshing ? challenges : [...state.challenges, ...challenges],
                loading: false,
                fetchedAll: !challenges || !challenges.length,
                refreshing: false
            }));
        } catch (e) {
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
        return this.state.loading
            ? <ActivityIndicator style={{ marginTop: 20 }} size='large'/>
            : null;
    };

    render() {
        const { ListEmptyComponent, ...flatListProps } = this.props.flatListProps || {};

        return (
            <FlatList
                {...flatListProps}
                data={this.state.challenges}
                keyExtractor={item => item.id}
                renderItem={({ item }: { item: Challenge }) => (
                    <ChallengeCard
                        challenge={item}
                        onChallengePress={() => this.props.onChallengePress && this.props.onChallengePress(item)}
                        onProfilePress={this.props.onProfilePress}
                    >
                        <Divider style={{ marginVertical: 16 }} />

                        <ChallengeToolbar
                            liked={item.likedByUser}
                            likedBy={item.likedBy}
                            onCommentPress={() => this.props.onCommentPress && this.props.onCommentPress(item)}
                            onLikePress={() => console.log('like')}
                        />
                    </ChallengeCard>
                )}
                ListFooterComponent={this.renderListFooter}
                ListEmptyComponent={this.state.fetchedAll && ListEmptyComponent}
                onEndReachedThreshold={0.3}
                onEndReached={!this.state.loading && !this.state.fetchedAll && this.onScrollEnd}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
            />
        );
    }
}
