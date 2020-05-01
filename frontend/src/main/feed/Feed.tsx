import React from 'react';
import { Text, View } from 'react-native';
import { FeedNavigationProp } from './FeedStackNavigator';

interface FeedProps {
    navigation: FeedNavigationProp;
}

export const Feed: React.FC<FeedProps> = ({ navigation }) => {
    return (
        <View>
            <Text>Feed</Text>
        </View>
    );
};
