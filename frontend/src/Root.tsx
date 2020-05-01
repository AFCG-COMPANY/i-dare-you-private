import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as firebase from 'firebase';
import { firebaseConfig } from './constants/firebase.config';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import { getUserAvatar, getUserInfo } from './api/api';
import { AuthNavigator } from './screens/auth/AuthNavigator';
import { MainNavigator } from './screens/main/MainNavigator';
import {
    AppActionTypes,
    AppState,
    INITIAL_STATE,
    AppContext
} from './contexts/AppContext';
import { User } from './models';

function reducer(
    state: AppState,
    action: { type: AppActionTypes; payload: any }
): AppState {
    switch (action.type) {
        case AppActionTypes.SetUser:
            return { ...state, user: action.payload };
        default:
            return state;
    }
}

export default function Root() {
    const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        // Unsubscribe on unmount
        return firebase.auth().onAuthStateChanged((user) => {
            if (user?.uid) {
                Promise.all([
                    getUserInfo(user.uid),
                    getUserAvatar(user.uid)
                ])
                    .then(([userInfo, avatar]) => {
                        dispatch({
                            type: AppActionTypes.SetUser,
                            payload: {
                                ...userInfo,
                                id: user.uid,
                                avatar
                            } as User
                        });
                    }).catch((e) => {
                        dispatch({
                            type: AppActionTypes.SetUser,
                            payload: null
                        });
                        console.log(e);
                    })
                    .finally(() => setLoading(false));
            } else {
                dispatch({ type: AppActionTypes.SetUser, payload: null });
                setLoading(false);
            }
        });
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ActivityIndicator style={{ flex: 1 }} size='large' />
            </SafeAreaView>
        );
    }

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <NavigationContainer>
                {state.user ? (
                    <MainNavigator user={state.user} />
                ) : (
                    <AuthNavigator />
                )}
            </NavigationContainer>
        </AppContext.Provider>
    );
}
