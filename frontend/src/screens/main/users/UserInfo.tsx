import React from 'react';
import { UsersStackParamList } from './UsersStackNavigator';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserProfile } from '../../../components';

type UserInfoRouteProp = RouteProp<UsersStackParamList, 'UserInfo'>;
type UserInfoNavigationProp = StackNavigationProp<UsersStackParamList, 'UserInfo'>;

interface UserInfoProps {
    route: UserInfoRouteProp,
    navigation: UserInfoNavigationProp;
}

export const UserInfo: React.FC<UserInfoProps> = ({ route }) => (
    <UserProfile user={route.params.user} />
);
