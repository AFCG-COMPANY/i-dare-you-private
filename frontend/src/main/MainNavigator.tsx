import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feed from './Feed';
import Profile from './Profile';

const Tabs = createBottomTabNavigator();

export const MainNavigator = () => (
    <Tabs.Navigator>
        <Tabs.Screen name='Feed' component={Feed} />
        <Tabs.Screen name='Profile' component={Profile} />
    </Tabs.Navigator>
);
