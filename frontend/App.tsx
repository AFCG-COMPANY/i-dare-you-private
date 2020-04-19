import React from 'react';
import { Text } from 'react-native';
import * as firebase from 'firebase';
import { firebaseConfig } from './firebase.config';
import { NavigationContainer } from '@react-navigation/native';
import { MainTabsScreen } from './screens/Main/Tabs';
import { AuthStackScreen } from './screens/Auth/Navigator';


export default function App() {
    const [ loading, setLoading ] = React.useState(true);
    const [ user, setUser ] = React.useState();

    React.useEffect(() => {
        firebase.initializeApp(firebaseConfig);

        const subscriber = firebase.auth().onAuthStateChanged((user: any) => {
            setUser(user);
            setLoading(false);
        });
        return subscriber; // unsubscribe on unmount
    }, []);

    return (
        <NavigationContainer>
            {loading ? (
                <Text>Loading...</Text>
            ) : user ? (
                <MainTabsScreen />
            ) : (
                <AuthStackScreen />
            )}
        </NavigationContainer>
    )
}
