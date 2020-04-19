import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feed from './screens/Feed';
import Profile from './screens/Profile';

const Tabs = createBottomTabNavigator();

export const MainNavigator = () => (
    <Tabs.Navigator>
        <Tabs.Screen name='Feed' component={Feed} />
        <Tabs.Screen name='Profile' component={Profile} />
    </Tabs.Navigator>
);
