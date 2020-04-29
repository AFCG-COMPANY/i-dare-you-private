import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainNavigatorParamList } from '../MainNavigator';
import { CompositeNavigationProp } from '@react-navigation/native';
import { Feed } from './Feed';

export type FeedStackParamList = {
    Feed: undefined;
};

export type FeedNavigationProp = CompositeNavigationProp<
    StackNavigationProp<FeedStackParamList, 'Feed'>,
    BottomTabNavigationProp<MainNavigatorParamList>
>;

interface FeedStackProps {
    navigation: FeedNavigationProp
}

const FeedStack = createStackNavigator<FeedStackParamList>();

export const FeedStackNavigator: React.FC<FeedStackProps> = ({ navigation }) => {
    return (
        <FeedStack.Navigator>
            <FeedStack.Screen
                name='Feed'
                component={Feed}
            />
        </FeedStack.Navigator>
    );
};
