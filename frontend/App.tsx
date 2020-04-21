import React from 'react';
import * as firebase from 'firebase';
import { firebaseConfig } from './firebase.config';
import { ActivityIndicator, SafeAreaView, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './src/auth/AuthNavigator';
import { MainNavigator } from './src/main/MainNavigator';

export default function App() {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        firebase.initializeApp(firebaseConfig);

        const subscriber = firebase.auth().onAuthStateChanged((user: any) => {
            setUser(user);
            setLoading(false);
        });
        return subscriber; // unsubscribe on unmount
    }, []);

    if (loading) {
        return (
            <SafeAreaView>
                <Text>Loading...</Text>
                <ActivityIndicator size='large' />
            </SafeAreaView>
        );
    }

    return (
        <NavigationContainer>
            {user ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}
