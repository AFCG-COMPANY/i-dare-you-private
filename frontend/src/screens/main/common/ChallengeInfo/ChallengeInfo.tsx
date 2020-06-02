import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Divider, Overlay } from 'react-native-elements';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Challenge, User } from '../../../../models';
import { ChallengeCard } from '../../../../components';
import { AppActionTypes, AppContext } from '../../../../contexts/AppContext';
import { ChallengeStatus } from '../../../../models/challenge';
import { Actions, ActionsLoadingType } from './components/Actions';
import { endChallenge, setChallengeOpponent, setChallengeProgress, voteOnChallenge } from '../../../../api/challenge';

type ParentStackParamsList = {
    UserInfo: { user: User };
    ChallengeInfo: { challenge: Challenge, commentPressed?: boolean };
};
type ChallengeInfoRouteProp = RouteProp<ParentStackParamsList, 'ChallengeInfo'>;
type ChallengeInfoNavigationProp = StackNavigationProp<ParentStackParamsList, 'ChallengeInfo'>;

interface ChallengeInfoProps {
    route: ChallengeInfoRouteProp,
    navigation: ChallengeInfoNavigationProp;
}
export const ChallengeInfo: React.FC<ChallengeInfoProps> = ({ route, navigation }) => {
    const { state, dispatch } = React.useContext(AppContext);
    const user = state.user as User;

    const { commentPressed } = route.params;
    const [ challenge, setChallenge ] = React.useState(route.params.challenge);
    const [ loading, setLoading ] = React.useState<ActionsLoadingType>(null);
    const userIsCreator = user.id === challenge.createdBy.id;

    React.useEffect(() => {
        dispatch({ type: AppActionTypes.SetChallenge, payload: challenge });
    }, [challenge])

    const onMakeBidPress = async (bid: string) => {
        setLoading('join');

        try {
            await setChallengeOpponent(challenge.id, user.id, bid);

            setChallenge({
                ...challenge,
                status: ChallengeStatus.InProgress,
                isOpponent: true,
                opponents: [...challenge.opponents, user] as User[]
            });
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(null);
        }
    };

    const onSetProgress = async (progress: number) => {
        setLoading('setProgress');

        try {
            await setChallengeProgress(challenge.id, progress);

            setChallenge({
                ...challenge,
                creatorProgress: progress
            });
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(null);
        }
    };

    const onEndChallenge = async () => {
        setLoading('end');

        try {
            await endChallenge(challenge.id);

            setChallenge({
                ...challenge,
                status: ChallengeStatus.Voting
            });
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(null);
        }
    };

    const onVotePress = async (vote: boolean) => {
        setLoading(vote ? 'voteSuccess' : 'voteFail');

        try {
            await voteOnChallenge(challenge.id, user.id, vote);
            if (userIsCreator) {
                setChallenge({...challenge, creatorVote: vote});
            } else {

            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(null);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <ChallengeCard
                challenge={challenge}
                onProfilePress={user => navigation.push('UserInfo', { user })}
            >
                <Divider style={styles.divider} />
                <View style={styles.actions}>
                    <Actions
                        loading={loading}
                        isCreator={userIsCreator}
                        isOpponent={challenge.isOpponent}
                        status={challenge.status}
                        creatorProgress={challenge.creatorProgress}
                        creatorVote={challenge.creatorVote}
                        onProgressChangePress={onSetProgress}
                        onEndChallengePress={onEndChallenge}
                        onMakeBidPress={onMakeBidPress}
                        onVotePress={onVotePress}
                    />
                </View>
            </ChallengeCard>

            <Overlay isVisible={loading != null}
                     containerStyle={{ backgroundColor: 'transparent' }}
                     overlayStyle={{ display: 'none' }}
            >
                <></>
            </Overlay>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1
    },
    divider: {
        marginVertical: 16
    },
    actions: {
    }
});
