import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Divider } from 'react-native-elements';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Challenge, User } from '../../../../models';
import { ChallengeCard } from '../../../../components';
import { AppContext } from '../../../../contexts/AppContext';
import { ChallengeStatus } from '../../../../models/challenge';
import { Actions } from './components/Actions';

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
    const { challenge, commentPressed } = route.params;
    const userIsCreator = state.user?.id === challenge.createdBy.id;

    return (
        <ScrollView style={styles.container}>
            <ChallengeCard
                challenge={challenge}
                onProfilePress={user => navigation.push('UserInfo', { user })}
            >
                <Divider style={styles.divider} />
                <View style={styles.actions}>
                    <Actions
                        status={ChallengeStatus.Created}
                        isCreator={userIsCreator}
                        isOpponent={challenge.currentUserIsOpponent}
                        onProgressChangePress={progress => console.log('Progress set to', progress)}
                        onEndChallengePress={() => console.log('End challenge')}
                        onMakeBidPress={bid => console.log('Bid was made:', bid)}
                        onVotePress={vote => console.log('Voted', vote)}
                    />
                </View>
            </ChallengeCard>
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
