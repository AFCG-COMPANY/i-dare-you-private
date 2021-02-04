import React from 'react';
import { Button, Icon } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import * as firebase from 'firebase';
import Onboarding from 'react-native-onboarding-swiper';
import { firebaseConfig } from './constants/firebase.config';
import { ActivityIndicator, SafeAreaView, AsyncStorage, Alert, Image } from 'react-native';
import { getUser, getUserAvatar } from './api/user';
import { AuthNavigator } from './screens/auth/AuthNavigator';
import { MainNavigator } from './screens/main/MainNavigator';
import OnboardingScreens from './components/Onboarding';
import * as Localization from 'expo-localization';
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
    const [intro, setIntro] = React.useState<string | null>(null);

    const [lang, setLang] = React.useState<string>('ru-RU');
    const [title, setTitle] = React.useState<string>('');
    const [subtitle, setSubtitle] = React.useState<string>('');
    const [screen1, setScreen1] = React.useState<string>('');
    const [screen2, setScreen2] = React.useState<string>('');
    const [screen3, setScreen3] = React.useState<string>('');
    const [screen4, setScreen4] = React.useState<string>('');
    const [screen5, setScreen5] = React.useState<string>('');
    const [screen6, setScreen6] = React.useState<string>('');

    React.useEffect(async () => {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        const value = await AsyncStorage.getItem('@SKIP_INTRO');
        setIntro(value)
        const locale = await Localization.getLocalizationAsync();
        console.log(locale.locale);
        if (locale.locale !== lang){ // not ru-Ru set en-EN
          setLang(locale.locale)
          setTitle('Start achieve goals')
          setSubtitle('Check out our tutorial or just skip it!')
          setScreen1('https://firebasestorage.googleapis.com/v0/b/i-dare-you-142ea.appspot.com/o/onboarding%2Fa1-f1-m16155-ii_kgguqnui5.png?alt=media&token=a7bfa422-2cce-4abe-82d4-c6262362e2ca')
          setScreen2('https://firebasestorage.googleapis.com/v0/b/i-dare-you-142ea.appspot.com/o/onboarding%2Fa1-f1-m16155-ii_kgguqnur6.png?alt=media&token=956593f9-5275-4d75-be65-482701ba9ded')
          setScreen3('https://firebasestorage.googleapis.com/v0/b/i-dare-you-142ea.appspot.com/o/onboarding%2Fa1-f1-m16155-ii_kgguqnuz7.png?alt=media&token=3bb11648-e1ae-44eb-a7e9-a960fcb19550')
          setScreen4('https://firebasestorage.googleapis.com/v0/b/i-dare-you-142ea.appspot.com/o/onboarding%2Fa1-f1-m16155-ii_kgguqnv88.png?alt=media&token=aef48009-c3eb-4bba-8ff2-b85214f27d6b')
          setScreen5('https://firebasestorage.googleapis.com/v0/b/i-dare-you-142ea.appspot.com/o/onboarding%2Fa1-f1-m16155-ii_kgguqnvj9.png?alt=media&token=79b0cdd7-a53f-4243-973c-c56359844dcf')
          setScreen6('https://firebasestorage.googleapis.com/v0/b/i-dare-you-142ea.appspot.com/o/onboarding%2Fa1-f1-m16155-ii_kgguqnvs10.png?alt=media&token=00d96eb4-1b5c-44a9-aab7-747f23ef6cf6')
        } else {
          setTitle('Начинайте спорить!')
          setSubtitle('Посмотрите наше обучение или просто пропустите его!')
          setScreen1('https://firebasestorage.googleapis.com/v0/b/i-dare-you-142ea.appspot.com/o/onboarding%2Fa1-f1-m16155-ii_kgguqnw111.png?alt=media&token=fcd13798-cd68-4c81-a076-803556e42aa0')
          setScreen2('https://firebasestorage.googleapis.com/v0/b/i-dare-you-142ea.appspot.com/o/onboarding%2Fa1-f1-m16155-ii_kgguqns70.png?alt=media&token=dbf77768-7f3f-41b7-9ef3-3bcc86e8a93b')
          setScreen3('https://firebasestorage.googleapis.com/v0/b/i-dare-you-142ea.appspot.com/o/onboarding%2Fa1-f1-m16155-ii_kgguqnst1.png?alt=media&token=d3a424c1-db80-4741-b820-d49b28df16bc')
          setScreen4('https://firebasestorage.googleapis.com/v0/b/i-dare-you-142ea.appspot.com/o/onboarding%2Fa1-f1-m16155-ii_kgguqnt82.png?alt=media&token=6cdbea95-ea70-4187-8891-bf8ebc0c599b')
          setScreen5('https://firebasestorage.googleapis.com/v0/b/i-dare-you-142ea.appspot.com/o/onboarding%2Fa1-f1-m16155-ii_kgguqntq3.png?alt=media&token=32b5b529-bbd3-49ac-a01e-72849bb50c91')
          setScreen6('https://firebasestorage.googleapis.com/v0/b/i-dare-you-142ea.appspot.com/o/onboarding%2Fa1-f1-m16155-ii_kgguqnu64.png?alt=media&token=45863af7-2f15-4a4f-8bd9-06841795b4ac')
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

    // if (intro !== null || intro !== 'true') {
    //     console.log(intro, 'intro');
    //     return (
    //         <Onboarding
    //         showDone={false}
    //         onSkip={() => {setIntro('true')}}
    //         pages={[
    //           {
    //             title: title,
    //             subtitle: subtitle,
    //             backgroundColor: '#1565c0',
    //             image: (
    //               <Icon name="rocket" type="font-awesome" size={100} color="white" />
    //             ),
    //           },
    //           {
    //             title: 'screen1',
    //             subtitle: 'You can reach everybody with us',
    //             backgroundColor: '#5e92f3',
    //             image: (
    //               <Image
    //                 source={{ uri: screen1 }}
    //                 style={{ width: 400, height: '100%' }}
    //                 resizeMode="contain"
    //               />
    //             ),
    //           },
    //           {
    //             title: 'screen2',
    //             subtitle: 'You can reach everybody with us',
    //             backgroundColor: '#5e92f3',
    //             image: (
    //               <Image
    //                 source={{ uri: screen2 }}
    //                 style={{ width: 400, height: '100%' }}
    //                 resizeMode="contain"
    //               />
    //             ),
    //           },
    //           {
    //             title: 'screen3',
    //             subtitle: 'Welcome to $App!',
    //             backgroundColor: '#003c8f',
    //             image: (
    //               <Image
    //                 source={{ uri: screen3 }}
    //                 style={{ width: 400, height: '100%' }}
    //                 resizeMode="contain"
    //               />
    //             ),
    //           },
    //           {
    //             title: 'screen4',
    //             subtitle: 'Welcome to $App!',
    //             backgroundColor: '#003c8f',
    //             image: (
    //               <Image
    //                 source={{ uri: screen4 }}
    //                 style={{ width: 400, height: '100%' }}
    //                 resizeMode="contain"
    //               />
    //             ),
    //           },
    //           {
    //             title: 'screen5',
    //             subtitle: 'Welcome to $App!',
    //             backgroundColor: '#003c8f',
    //             image: (
    //               <Image
    //                 source={{ uri: screen5 }}
    //                 style={{ width: 400, height: '100%' }}
    //                 resizeMode="contain"
    //               />
    //             ),
    //           },
    //           {
    //             title: 'screen6',
    //             subtitle: 'Welcome to $App!',
    //             backgroundColor: '#003c8f',
    //             image: (
    //               <Image
    //                 source={{ uri: screen6 }}
    //                 style={{ width: 400, height: '100%' }}
    //                 resizeMode="contain"
    //               />
    //             ),
    //           },
    //           {
    //             title: "Отлично! Можете начинать",
    //             subtitle: (
    //               <Button
    //                 title={'Начать'}
    //                 containerViewStyle={{ marginTop: 20 }}
    //                 backgroundColor={'white'}
    //                 borderRadius={5}
    //                 textStyle={{ color: '#003c8f' }}
    //                 onPress={() => {
    //                   Alert.alert('done');
    //                 }}
    //               />
    //             ),
    //             backgroundColor: '#003c8f',
    //             image: (
    //               <Icon name="rocket" type="font-awesome" size={100} color="white" />
    //             ),
    //           },
    //         ]}
    //       />
    //     );
    //  }
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
