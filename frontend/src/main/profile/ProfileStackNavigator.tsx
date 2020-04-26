import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Profile } from './Profile';
import { Settings } from './Settings';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { Button } from 'react-native-elements';

export type ProfileParamList = {
    Profile: undefined;
};

interface ProfileStackProps {}

const ProfileStack = createStackNavigator<ProfileParamList>();

export const ProfileStackNavigator: React.FC<ProfileStackProps> = ({}) => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen
                name='Profile'
                component={Profile}
                options={({ navigation, route }) => ({
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
                component={Settings}
            />
        </ProfileStack.Navigator>
    );
};
