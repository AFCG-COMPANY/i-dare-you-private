import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainNavigatorParamList } from '../MainNavigator';
import { CompositeNavigationProp } from '@react-navigation/native';
import { Users } from './Users';

export type UsersStackParamList = {
    Users: undefined;
    Profile: undefined;
};

export type UsersNavigationProp = CompositeNavigationProp<
    StackNavigationProp<UsersStackParamList, 'Users'>,
    BottomTabNavigationProp<MainNavigatorParamList>
>;

interface UsersStackProps {
    navigation: UsersNavigationProp;
}

const UsersStack = createStackNavigator<UsersStackParamList>();

export const UsersStackNavigator: React.FC<UsersStackProps> = ({ navigation }) => {
    return (
        <UsersStack.Navigator>
            <UsersStack.Screen
                name='Users'
                component={Users}
            />
        </UsersStack.Navigator>
    );
};
