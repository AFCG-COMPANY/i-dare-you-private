import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Divider, Overlay } from 'react-native-elements';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Challenge, User } from '../../../../models';
import { ChallengeCard } from '../../../../components';
import { AppContext } from '../../../../contexts/AppContext';
import { ChallengeStatus } from '../../../../models/challenge';
import { Actions } from './components/Actions';
import { setChallengeOpponent } from '../../../../api/challenge';

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
    const { state } = React.useContext(AppContext);
    const user = state.user as User;

    const { commentPressed } = route.params;
    const [ challenge, setChallenge ] = React.useState(route.params.challenge);
    const [ loading, setLoading ] = React.useState(false);
    const userIsCreator = user.id === challenge.createdBy.id;

    const onMakeBidPress = async (bid: string) => {
        setLoading(true);

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
            setLoading(false);
        }
    }

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
                        onProgressChangePress={progress => console.log('Progress set to', progress)}
                        onEndChallengePress={() => console.log('End challenge')}
                        onMakeBidPress={onMakeBidPress}
                        onVotePress={vote => console.log('Voted', vote)}
                    />
                </View>
            </ChallengeCard>

            <Overlay isVisible={loading}
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
