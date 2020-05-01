import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainNavigatorParamList } from '../MainNavigator';
import { CompositeNavigationProp } from '@react-navigation/native';
import { Users } from './Users';

export type ProfileStackParamList = {
    Users: undefined;
    Profile: undefined;
};

export type UsersNavigationProp = CompositeNavigationProp<
    StackNavigationProp<ProfileStackParamList, 'Users'>,
    BottomTabNavigationProp<MainNavigatorParamList>
>;

interface UsersStackProps {
    navigation: UsersNavigationProp;
}

const ProfileStack = createStackNavigator<ProfileStackParamList>();

export const UsersStackNavigator: React.FC<UsersStackProps> = ({ navigation }) => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen
                name='Users'
                component={Users}
            />
        </ProfileStack.Navigator>
    );
};
