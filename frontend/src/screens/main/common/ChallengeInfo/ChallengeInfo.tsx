import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider } from 'react-native-elements';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Challenge, User } from '../../../../models';
import { ChallengeCard } from '../../../../components';
import { Actions } from './components/Actions';
import { AppContext } from '../../../../contexts/AppContext';
import { ChallengeStatus } from '../../../../models/challenge';

type ParentStackParamsList = {
    UserInfo: { user: User }
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
    const { challenge, commentPressed } = route.params;

    // User is participant if he is in opponents list or he is creator
    const userIsParticipant = challenge.currentUserIsOpponent || state.user?.id === challenge.createdBy.id;

    return (
        <View style={styles.container}>
            <ChallengeCard
                challenge={challenge}
                onProfilePress={user => navigation.push('UserInfo', { user })}
            >
                <Divider style={styles.divider} />
                <Actions
                    containerStyle={styles.actions}
                    status={ChallengeStatus.Created}
                    isParticipant={userIsParticipant}
                />
            </ChallengeCard>
        </View>
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
    actions: {}
});
