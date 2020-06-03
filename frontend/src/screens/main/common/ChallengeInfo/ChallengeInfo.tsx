import React from 'react';
import { StyleSheet } from 'react-native';
import { Divider, Overlay } from 'react-native-elements';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Challenge, User } from '../../../../models';
import { ChallengeCard } from '../../../../components';
import { AppActionTypes, AppContext } from '../../../../contexts/AppContext';
import { ChallengeStatus } from '../../../../models/challenge';
import { Actions, ActionsLoadingType } from './components/Actions';
import {
    commentOnChallenge,
    endChallenge, getChallengeComments,
    setChallengeOpponent,
    setChallengeProgress,
    voteOnChallenge
} from '../../../../api/challenge';
import { Comments } from './components/Comments';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
    const [ shouldFocusInput, setShouldFocusInput ] = React.useState<boolean>();
    const userIsCreator = user.id === challenge.createdBy.id;

    const scrollRef = React.useRef<KeyboardAwareScrollView>(null);
    const loadingComments = challenge.comments == null;

    React.useEffect(() => {
        return navigation.addListener('focus', async () => {
            setShouldFocusInput(commentPressed);

            try {
                const comments = await getChallengeComments(challenge.id);
                setChallenge({...challenge, comments});
            } catch (e) {
                console.log(e);
            }
        });
    }, []);

    React.useEffect(() => {
        dispatch({ type: AppActionTypes.SetChallenge, payload: challenge });
    }, [challenge]);

    React.useEffect(() => {
        challenge.commentsChanged && scrollRef.current?.scrollToEnd();
        challenge.commentsChanged = false;
    }, [challenge.commentsChanged]);

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
            setChallenge({...challenge, userVote: vote});
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(null);
        }
    };

    const onPostCommentPress = async (message: string) => {
        if (message) {
            const comments = challenge.comments || [];
            comments.push({
                user: {
                    id: user.id,
                    username: user.username as string
                },
                message
            });

            challenge.comments = comments;
            challenge.commentsChanged = true;
            setChallenge({ ...challenge });

            try {
                await commentOnChallenge(
                    challenge.id,
                    { id: user.id, username: user.username as string },
                    message
                );
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <KeyboardAwareScrollView
            ref={scrollRef}
            style={styles.container}
            keyboardShouldPersistTaps='handled'
            enableOnAndroid={true}
        >
            <ChallengeCard
                challenge={challenge}
                onProfilePress={user => navigation.push('UserInfo', { user })}
            >
                <Divider style={styles.divider} />

                <Actions
                    loading={loading}
                    isCreator={userIsCreator}
                    isOpponent={challenge.isOpponent}
                    status={challenge.status}
                    creatorProgress={challenge.creatorProgress}
                    userVote={challenge.userVote}
                    onProgressChangePress={onSetProgress}
                    onEndChallengePress={onEndChallenge}
                    onMakeBidPress={onMakeBidPress}
                    onVotePress={onVotePress}
                />

                <Divider style={styles.divider} />

                <Comments
                    loading={loadingComments}
                    shouldFocusInput={shouldFocusInput}
                    comments={challenge.comments || []}
                    onPost={onPostCommentPress}
                />
            </ChallengeCard>

            <Overlay isVisible={loading != null}
                     containerStyle={{ backgroundColor: 'transparent' }}
                     overlayStyle={{ display: 'none' }}
            >
                <></>
            </Overlay>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    divider: {
        marginVertical: 16
    }
});
