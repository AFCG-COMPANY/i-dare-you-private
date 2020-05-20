import React from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { Challenge } from '../models';
import { getChallenges } from '../api/challenge';
import { ChallengeCard } from './ChallengeCard/ChallengeCard';

export interface ChallengesListProps {
    flatListProps?: any;
    filterBy?: 'participant' | 'likedBy';
    userId?: string;
}

interface ChallengesListState {
    loading: boolean;
    challenges: Challenge[];
    page: number;
    fetchedAll: boolean;
    refreshing: boolean;
}

export class ChallengesList extends React.Component<ChallengesListProps, ChallengesListState> {
    state = {
        loading: false,
        challenges: [],
        page: 0,
        fetchedAll: false,
        refreshing: false
    };

    componentDidMount = () => {
        this.fetchData();
    };

    fetchData = async () => {
        this.setState({ loading: true });

        const { filterBy, userId } = this.props;

        const challenges = await getChallenges(this.state.page, filterBy, userId);
        this.setState(state => ({
            challenges: state.refreshing ? challenges : [...state.challenges, ...challenges],
            loading: false,
            fetchedAll: !challenges || !challenges.length,
            refreshing: false
        }));
    };

    onScrollEnd = () => {
        if (this.state.fetchedAll) {
            return;
        }

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
                    <ChallengeCard challenge={item}/>
                )}
                ListFooterComponent={this.renderListFooter}
                ListEmptyComponent={this.state.fetchedAll && ListEmptyComponent}
                onEndReachedThreshold={0.3}
                onEndReached={this.onScrollEnd}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
            />
        );
    }
}
