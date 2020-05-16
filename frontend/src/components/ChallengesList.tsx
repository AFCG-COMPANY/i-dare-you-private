import React from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { Challenge } from '../models';
import { getChallenges } from '../api/challenge';
import { ChallengeCard } from './ChallengeCard';

export interface ChallengesListProps {
    flatListProps: any;
    filterBy?: 'participant' | 'likedBy';
    userId?: string;
}

interface ChallengesListState {
    loading: boolean;
    refreshing: boolean;
    challenges: Challenge[];
    currentPage: number;
    fetchedAll: boolean;
}

export class ChallengesList extends React.Component<ChallengesListProps, ChallengesListState> {
    state = {
        loading: false,
        refreshing: false,
        challenges: [],
        currentPage: 0,
        fetchedAll: false
    };

    componentDidMount = () => {
        this.retrieveData(true);
    }

    retrieveData = async (firstTime: boolean = false) => {
        this.setState({
            loading: true,
            refreshing: !firstTime
        });

        const { currentPage } = this.state;
        const { filterBy, userId } = this.props;

        const challenges = await getChallenges(currentPage, filterBy, userId);

        this.setState(state => ({
            challenges: [...state.challenges, ...challenges],
            currentPage: state.currentPage + 1,
            loading: false,
            refreshing: false,
            fetchedAll: !challenges || challenges.length === 0
        }));
    };

    renderListFooter = () => {
        return this.state.loading
            ? <ActivityIndicator size='large' />
            : null
    }

    render() {
        const { fetchedAll, refreshing, challenges } = this.state;

        return (
            <FlatList
                data={challenges}
                keyExtractor={item => item.id}
                renderItem={({item}: {item: Challenge}) => (
                    <ChallengeCard challenge={item} />
                )}
                onEndReachedThreshold={1}
                onEndReached={fetchedAll && this.retrieveData as any}
                refreshing={refreshing}
                ListFooterComponent={this.renderListFooter}
            />
        );
    }
}
