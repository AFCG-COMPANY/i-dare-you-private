import React from 'react';
import {
    createStackNavigator,
    StackNavigationProp
} from '@react-navigation/stack';
import { Profile } from './Profile';
import { UserProfileEdit } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { Button } from 'react-native-elements';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainNavigatorParamList } from '../MainNavigator';
import { CompositeNavigationProp } from '@react-navigation/native';
import * as firebase from 'firebase';

export type ProfileStackParamList = {
    Profile: undefined;
    Settings: undefined;
};

export type ProfileNavigationProp = CompositeNavigationProp<
    StackNavigationProp<ProfileStackParamList, 'Profile'>,
    BottomTabNavigationProp<MainNavigatorParamList>
>;

interface ProfileStackProps {
    navigation: ProfileNavigationProp;
}

const ProfileStack = createStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator: React.FC<ProfileStackProps> = ({ navigation }) => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen
                name='Profile'
                component={Profile}
                options={() => ({
                    headerRight: () => (
                        <Button
                            type='clear'
                            containerStyle={{marginRight: 20}}
                            icon={<Ionicons name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'} size={20} />}
                            onPress={() => navigation.navigate('Settings')}
                        />
                    )
                })}
            />
            <ProfileStack.Screen
                name='Settings'
                component={UserProfileEdit}
                options={() => ({
                    headerRight: () => (
                        <Button
                            type='clear'
                            containerStyle={{marginRight: 20}}
                            icon={<Ionicons name={Platform.OS === 'ios' ? 'ios-exit' : 'md-exit'} size={30} />}
                            onPress={() => firebase.auth().signOut()}
                        />
                    )
                })}
            />
        </ProfileStack.Navigator>
    );
};
