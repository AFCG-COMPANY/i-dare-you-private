import React from 'react';
import * as firebase from 'firebase';
import { firebaseConfig } from './firebase.config';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './src/auth/AuthNavigator';
import { MainNavigator } from './src/main/MainNavigator';
import { getUserInfo } from './src/api';
import { User } from './src/models';

export default function App() {
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        firebase.initializeApp(firebaseConfig);

        // Unsubscribe on unmount
        return firebase.auth().onAuthStateChanged(user => {
            if (user?.uid) {
                getUserInfo(user.uid)
                    .then(userInfo => {
                        setUser(userInfo)
                        console.log(userInfo)
                    })
                    .catch((e) => {
                        console.log(e)
                        setUser(null)
                    })
                    .finally(() => setLoading(false))
            } else {
                setUser(null);
                setLoading(false);
            }
        });
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={{flex: 1}}>
                <ActivityIndicator style={{flex: 1}} size='large' />
            </SafeAreaView>
        );
    }

    return (
        <NavigationContainer>
            {user ? <MainNavigator user={user} /> : <AuthNavigator />}
        </NavigationContainer>
    );
}
