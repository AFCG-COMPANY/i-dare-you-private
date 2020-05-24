import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainNavigatorParamList } from '../MainNavigator';
import { CompositeNavigationProp } from '@react-navigation/native';
import { Favorites } from './Favorites';
import { Challenge, User } from '../../../models';
import { UserInfo } from '../common/UserInfo';

export type FavoriteStackParamList = {
    Favorites: undefined;
    UserInfo: { user: User };
    ChallengeInfo: { challenge: Challenge, commentPressed?: boolean };
};

export type FavoriteNavigationProp = CompositeNavigationProp<
    StackNavigationProp<FavoriteStackParamList, 'Favorites'>,
    BottomTabNavigationProp<MainNavigatorParamList>
>;

interface FeedStackProps {
    navigation: FavoriteNavigationProp;
}

const FavoriteStack = createStackNavigator<FavoriteStackParamList>();

export const FavoriteStackNavigator: React.FC<FeedStackProps> = () => {
    return (
        <FavoriteStack.Navigator>
            <FavoriteStack.Screen
                name='Favorites'
                component={Favorites}
                options={{ title: 'Bookmarks' }}
            />
            <FavoriteStack.Screen
                name='UserInfo'
                component={UserInfo}
                options={({ route }) => ({ title: route.params.user.username })}
            />
            {/*<FavoriteStack.Screen*/}
            {/*    name='ChallengeInfo'*/}
            {/*    component={ChallengeInfo}*/}
            {/*    options={{ title: 'Challenge' }}*/}
            {/*/>*/}
        </FavoriteStack.Navigator>
    );
};
