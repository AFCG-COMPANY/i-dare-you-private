import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainNavigatorParamList } from '../MainNavigator';
import { CompositeNavigationProp } from '@react-navigation/native';
import { Feed } from './Feed';
import { Challenge, User } from '../../../models';
import { ChallengeInfo } from './ChallengeInfo';
import { UserInfo } from '../common/UserInfo';

export type FeedStackParamList = {
    Feed: undefined;
    UserInfo: { user: User };
    ChallengeInfo: { challenge: Challenge, commentPressed?: boolean };
};

export type FeedNavigationProp = CompositeNavigationProp<
    StackNavigationProp<FeedStackParamList, 'Feed'>,
    BottomTabNavigationProp<MainNavigatorParamList>
>;

interface FeedStackProps {
    navigation: FeedNavigationProp;
}

const FeedStack = createStackNavigator<FeedStackParamList>();

export const FeedStackNavigator: React.FC<FeedStackProps> = () => {
    return (
        <FeedStack.Navigator>
            <FeedStack.Screen
                name='Feed'
                component={Feed}
            />
            <FeedStack.Screen
                name='UserInfo'
                component={UserInfo}
                options={({ route }) => ({ title: route.params.user.username })}
            />
            <FeedStack.Screen
                name='ChallengeInfo'
                component={ChallengeInfo}
                options={{ title: 'Challenge' }}
            />
        </FeedStack.Navigator>
    );
};
