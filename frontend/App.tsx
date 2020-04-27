import React from 'react';
import * as firebase from 'firebase';
import { firebaseConfig } from './firebase.config';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import { getUserInfo } from './src/api';
import { AuthNavigator } from './src/auth/AuthNavigator';
import { MainNavigator } from './src/main/MainNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { AppActionTypes, AppState, INITIAL_STATE, AppContext } from './src/contexts/AppContext';


function reducer(state: AppState, action: { type: AppActionTypes; payload: any }): AppState {
    switch (action.type) {
        case AppActionTypes.SetUser:
            return { ...state, user: action.payload };
        default:
            return state;
    }
}

export default function App() {
    const [ state, dispatch ] = React.useReducer(reducer, INITIAL_STATE);
    const [ loading, setLoading ] = React.useState<boolean>(true);

    React.useEffect(() => {
        firebase.initializeApp(firebaseConfig);

        // Unsubscribe on unmount
        return firebase.auth().onAuthStateChanged(user => {
            if (user?.uid) {
                getUserInfo(user.uid)
                    .then(userInfo => {
                        dispatch({ type: AppActionTypes.SetUser, payload: { ...userInfo, id: user.uid } })
                        console.log('USER INFO\n', userInfo)
                    })
                    .catch((e) => {
                        dispatch({ type: AppActionTypes.SetUser, payload: null })
                        console.log(e)
                    })
                    .finally(() => setLoading(false))
            } else {
                dispatch({ type: AppActionTypes.SetUser, payload: null })
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
        <AppContext.Provider
            value={{ state, dispatch }}
        >
            <NavigationContainer>
                {state.user ? <MainNavigator user={state.user} /> : <AuthNavigator />}
            </NavigationContainer>
        </AppContext.Provider>
    );
}
