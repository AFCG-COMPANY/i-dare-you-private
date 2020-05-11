import React from 'react';
import {
    createStackNavigator,
    StackNavigationProp
} from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainNavigatorParamList } from '../MainNavigator';
import { CompositeNavigationProp } from '@react-navigation/native';
import { CreateChallenge } from './CreateChallenge';

export type ChallengeStackParamList = {
    CreateChallenge: undefined;
};

export type ChallengeNavigationProp = CompositeNavigationProp<
    StackNavigationProp<ChallengeStackParamList, 'CreateChallenge'>,
    BottomTabNavigationProp<MainNavigatorParamList>
>;

interface CreateChallengeStackProps {
    navigation: ChallengeNavigationProp;
}

const ChallengeStack = createStackNavigator<ChallengeStackParamList>();

export const CreateChallengeStackNavigator: React.FC<CreateChallengeStackProps> = () => {
    return (
        <ChallengeStack.Navigator>
            <ChallengeStack.Screen
                name='CreateChallenge'
                options={{ title: 'New Challenge' }}
                component={CreateChallenge}
            />
        </ChallengeStack.Navigator>
    );
};
