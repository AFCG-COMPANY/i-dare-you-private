import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as firebase from 'firebase';
import { firebaseConfig } from './constants/firebase.config';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import { getUser, getUserAvatar } from './api/user';
import { AuthNavigator } from './screens/auth/AuthNavigator';
import { MainNavigator } from './screens/main/MainNavigator';
import { AppActionTypes, AppContext, AppState, INITIAL_STATE } from './contexts/AppContext';
import { User } from './models';

function reducer(
    state: AppState,
    action: { type: AppActionTypes; payload: any }
): AppState {
    switch (action.type) {
        case AppActionTypes.SetUser:
            return { ...state, user: action.payload };
        case AppActionTypes.SetChallenge:
            return { ...state, challenge: action.payload }
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
                    getUser(user.uid),
                    getUserAvatar(user.uid)
                ])
                    .then((res) => {
                        const userInfo = res[0];
                        const avatarBase64 = res[1];

                        dispatch({
                            type: AppActionTypes.SetUser,
                            payload: {
                                ...userInfo,
                                id: user.uid,
                                avatarBase64: avatarBase64
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
