import React from 'react';
import { Text, View } from 'react-native';
import { FeedNavigationProp } from './FeedStackNavigator';
import { AppContext } from '../../contexts/AppContext';

interface FeedProps {
    navigation: FeedNavigationProp
}

export const Feed: React.FC<FeedProps> = ({ navigation }) => {
    const { state } = React.useContext(AppContext);

    if (!state.user?.username) {
        navigation.navigate('Profile', { screen: 'Settings' });
    }

    return (
        <View>
            <Text>Feed</Text>
        </View>
    );
}
