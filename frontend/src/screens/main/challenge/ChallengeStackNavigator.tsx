import React from 'react';
import {
    createStackNavigator,
    StackNavigationProp
} from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainNavigatorParamList } from '../MainNavigator';
import { CompositeNavigationProp } from '@react-navigation/native';
import { Challenge } from './Challenge';

export type ChallengeStackParamList = {
    Feed: undefined;
};

export type ChallengeNavigationProp = CompositeNavigationProp<
    StackNavigationProp<ChallengeStackParamList, 'Feed'>,
    BottomTabNavigationProp<MainNavigatorParamList>
>;

interface ChallengeStackProps {
    navigation: ChallengeNavigationProp;
}

const ChallengeStack = createStackNavigator<ChallengeStackParamList>();

export const ChallengeStackNavigator: React.FC<ChallengeStackProps> = ({ navigation }) => {
    return (
        <ChallengeStack.Navigator>
            <ChallengeStack.Screen name='Challenge' component={Challenge} />
        </ChallengeStack.Navigator>
    );
};