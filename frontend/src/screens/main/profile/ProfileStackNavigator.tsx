import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { Profile } from './Profile';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { Button } from 'react-native-elements';
import { MainNavigatorParamList } from '../MainNavigator';
import * as firebase from 'firebase';
import { AppContext } from '../../../contexts/AppContext';
import { Settings } from './Settings';

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
    const { state } = React.useContext(AppContext);
    const { user } = state;

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
                    ),
                    title: user?.username
                })}
            />
            <ProfileStack.Screen
                name='Settings'
                component={Settings}
                options={() => ({
                    headerRight: () => (
                        <Button
                            type='clear'
                            containerStyle={{marginRight: 20}}
                            icon={<Ionicons name={Platform.OS === 'ios' ? 'ios-exit' : 'md-exit'} size={30} />}
                            onPress={() => firebase.auth().signOut()}
                        />
                    ),
                    headerBackTitle: 'Profile'
                })}
            />
        </ProfileStack.Navigator>
    );
};
