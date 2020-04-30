import React from 'react';
import { Text, View } from 'react-native';
import { FeedNavigationProp } from './FeedStackNavigator';
import { AppContext } from '../../contexts/AppContext';
import { StackActions } from '@react-navigation/native';

interface FeedProps {
    navigation: FeedNavigationProp
}

export const Feed: React.FC<FeedProps> = ({ navigation }) => {
    const { state } = React.useContext(AppContext);

    if (!state.user?.username) {
        navigation.navigate('Profile', {  }, StackActions.push('Settings'));
    }

    return (
        <View>
            <Text>Feed</Text>
        </View>
    );
}
