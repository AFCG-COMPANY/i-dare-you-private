import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Profile } from './Profile';

export type ProfileParamList = {
    Profile: undefined;
};

interface ProfileStackProps {}

const ProfileStack = createStackNavigator<ProfileParamList>();

export const ProfileStackNavigator: React.FC<ProfileStackProps> = ({}) => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name="Profile" component={Profile} />
        </ProfileStack.Navigator>
    );
};
