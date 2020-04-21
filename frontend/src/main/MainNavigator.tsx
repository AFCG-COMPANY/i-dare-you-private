import React from 'react';
import { Platform } from 'react-native';
import {
    Feather,
    FontAwesome,
    FontAwesome5,
    Ionicons
} from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feed from './feed/Feed';
import { ProfileStackNavigator } from './profile/ProfileStackNavigator';

type MainNavigatorParamList = {
    Feed: undefined;
    Users: undefined;
    NewChallenge: undefined;
    Favorite: undefined;
    Profile: undefined;
};

interface MainNavigatorProps {}

const Tabs = createBottomTabNavigator<MainNavigatorParamList>();

export const MainNavigator: React.FC<MainNavigatorProps> = () => (
    <Tabs.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
                switch (route.name) {
                    case 'Feed':
                        return Platform.select({
                            ios: (
                                <Ionicons
                                    name='ios-home'
                                    size={size}
                                    color={color}
                                />
                            ),
                            android: (
                                <Ionicons
                                    name='md-home'
                                    size={size}
                                    color={color}
                                />
                            )
                        });
                    case 'Users':
                        return Platform.select({
                            ios: (
                                <Feather
                                    name='users'
                                    size={size}
                                    color={color}
                                />
                            ),
                            android: (
                                <FontAwesome5
                                    name='user-friends'
                                    size={size}
                                    color={color}
                                />
                            )
                        });
                    case 'NewChallenge':
                        return (
                            <FontAwesome
                                name='plus-square-o'
                                size={size}
                                color={color}
                            />
                        );
                    case 'Favorite':
                        return Platform.select({
                            ios: (
                                <Ionicons
                                    name='ios-heart-empty'
                                    size={size}
                                    color={color}
                                />
                            ),
                            android: (
                                <Ionicons
                                    name='md-heart-empty'
                                    size={size}
                                    color={color}
                                />
                            )
                        });
                    case 'Profile':
                        return Platform.select({
                            ios: (
                                <Feather
                                    name='user'
                                    size={size}
                                    color={color}
                                />
                            ),
                            android: (
                                <FontAwesome5
                                    name='user'
                                    size={size}
                                    color={color}
                                />
                            )
                        });
                }
            }
        })}
        tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray'
        }}
    >
        <Tabs.Screen name='Feed' component={Feed} />
        <Tabs.Screen name='Users' component={ProfileStackNavigator} />
        <Tabs.Screen name='NewChallenge' component={ProfileStackNavigator} />
        <Tabs.Screen name='Favorite' component={Feed} />
        <Tabs.Screen name='Profile' component={ProfileStackNavigator} />
    </Tabs.Navigator>
);
