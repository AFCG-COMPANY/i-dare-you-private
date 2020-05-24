import React from 'react';
import { Platform, SafeAreaView } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native-elements';
import { ProfileStackNavigator } from './profile/ProfileStackNavigator';
import { FeedStackNavigator } from './feed/FeedStackNavigator';
import { User } from '../../models';
import { UserProfileEdit } from '../../components';
import { UsersStackNavigator } from './users/UsersStackNavigator';
import { CreateChallengeStackNavigator } from './challenge/СreateChallengeStackNavigator';
import { FavoriteStackNavigator } from './favorite/FavoriteStackNavigator';

export type MainNavigatorParamList = {
    Feed: undefined;
    Users: undefined;
    CreateChallenge: undefined;
    Favorite: undefined;
    Profile: undefined;
};

interface MainNavigatorProps {
    user: User;
}

const Tabs = createBottomTabNavigator<MainNavigatorParamList>();

export const MainNavigator: React.FC<MainNavigatorProps> = ({ user }) => {
    if (user?.username) {
        return (
            <Tabs.Navigator
                initialRouteName='Feed'
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
                            case 'CreateChallenge':
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
                <Tabs.Screen name='Feed' component={FeedStackNavigator} />
                <Tabs.Screen name='Users' component={UsersStackNavigator} />
                <Tabs.Screen
                    name='CreateChallenge'
                    options={{ title: 'Challenge' }}
                    component={CreateChallengeStackNavigator}
                />
                <Tabs.Screen name='Favorite' component={FavoriteStackNavigator}/>
                <Tabs.Screen name='Profile' component={ProfileStackNavigator} />
            </Tabs.Navigator>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, padding: 40 }}>
            <Text
                style={{
                    marginTop: 20,
                    fontSize: 20,
                    fontWeight: '500',
                    alignSelf: 'center'
                }}
            >
                Fill in Profile Info
            </Text>
            <UserProfileEdit updateButtonTitle='Save' />
        </SafeAreaView>
    );
};
