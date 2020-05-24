import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainNavigatorParamList } from '../MainNavigator';
import { CompositeNavigationProp } from '@react-navigation/native';
import { Users } from './Users';
import { UserInfo } from './UserInfo';
import { Challenge, User } from '../../../models';

export type UsersStackParamList = {
    Users: undefined;
    UserInfo: { user: User };
    ChallengeInfo: { challenge: Challenge, commentPressed?: boolean }
};

export type UsersNavigationProp = CompositeNavigationProp<
    StackNavigationProp<UsersStackParamList, 'Users'>,
    BottomTabNavigationProp<MainNavigatorParamList>
>;

interface UsersStackProps {
    navigation: UsersNavigationProp;
}

const UsersStack = createStackNavigator<UsersStackParamList>();

export const UsersStackNavigator: React.FC<UsersStackProps> = () => {
    return (
        <UsersStack.Navigator>
            <UsersStack.Screen
                name='Users'
                component={Users}
            />
            <UsersStack.Screen
                name='UserInfo'
                component={UserInfo}
                options={({ route }) => ({ title: route.params.user.username })}
            />
        </UsersStack.Navigator>
    );
};
