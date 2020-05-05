import React from 'react';
import { UserProfileEdit } from '../../../components';
import { ProfileNavigationProp } from './ProfileStackNavigator';

interface SettingsProps {
    navigation: ProfileNavigationProp;
}

export const Settings: React.FC<SettingsProps> = ({ navigation }) => (
    <UserProfileEdit
        onSuccess={navigation.goBack}
    />
);
