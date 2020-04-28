import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import * as firebase from 'firebase';
import { Avatar, Button, Input } from 'react-native-elements';

import { DismissKeyboardView } from '../../components';
import { setUserInfo } from '../../api';
import { AppActionTypes, AppContext } from '../../contexts/AppContext';

interface SettingsProps {}

export const Settings: React.FC<SettingsProps> = ({}) => {
    const { state, dispatch } = React.useContext(AppContext);
    const { user } = state;

    if (!user) {
        return <ActivityIndicator size='large' />;
    }

    const [ usernameValue, setUsernameValue ] = React.useState(user.username);
    const [ bioValue, setBioValue ] = React.useState(user.bio);
    const { avatar } = user;

    React.useEffect(() => {
        getPermissionAsync();
    }, []);

    const getPermissionAsync = async () => {
        if (Constants.platform?.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                Alert.alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    const uriToBlob: (uri: string) => Promise<Blob | Uint8Array | ArrayBuffer> = uri => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => resolve(xhr.response);
            xhr.onerror = () => reject(new Error('uriToBlob failed'));
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });
    };

    const selectPhoto = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            });

            if (!result.cancelled) {
                const updateUserAction = { type: AppActionTypes.SetUser, payload: {...user, avatar: result.uri} };
                dispatch(updateUserAction);
            }
        } catch (e) {
            Alert.alert('Failed to upload photo. Please try again.');
        }
    };

    const savePhoto = async () => {
        if (avatar) {
            const splitedPhotoPath = avatar.split('.')
            const photoExtension = splitedPhotoPath[splitedPhotoPath.length - 1]
            const blob = await uriToBlob(avatar);
            const storageRef = firebase.storage().ref();

            try {
                const path: string = `avatars/${user.id}.${photoExtension}`

                await storageRef
                    .child(path)
                    .delete()

                await storageRef
                    .child(path)
                    .put(blob, { contentType: `image/${photoExtension}` })
            } catch (e) {
                Alert.alert('Failed to upload info. Please try again.')
                console.log(e);
            }
        }
    };

    const saveInfo = async () => {
        if (avatar) {
            if (avatar.startsWith('file')) {
                await savePhoto();
            }

            const splitPhotoPath = avatar.split('.');
            const photoExtension = splitPhotoPath[splitPhotoPath.length - 1]
            await setUserInfo({ ...user, avatar: `avatars/${user.id}.${photoExtension}` });
        }
    };

    return (
        <DismissKeyboardView style={styles.container}>
            <View style={styles.form}>
                <Avatar
                    containerStyle={styles.avatar}
                    showEditButton={true}
                    onEditPress={selectPhoto}
                    rounded
                    size='large'
                    source={{ uri: avatar }}
                />

                <Input
                    containerStyle={styles.inputContainer}
                    label='Display Name'
                    labelStyle={styles.inputLabel}
                    autoCapitalize='none'
                    value={usernameValue}
                    onChangeText={value => setUsernameValue(value) }
                />

                <Input
                    containerStyle={styles.inputContainer}
                    label='Bio'
                    labelStyle={styles.inputLabel}
                    autoCapitalize='none'
                    value={bioValue}
                    onChangeText={value => setBioValue(value)}
                />

                <Button
                    title='Update Profile'
                    containerStyle={styles.button}
                    onPress={saveInfo}
                />

                <Button
                    type='clear'
                    containerStyle={styles.signOutButton}
                    title='Sign Out'
                    onPress={() => firebase.auth().signOut()}
                />
            </View>
        </DismissKeyboardView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 40,
        flex: 1,
        backgroundColor: '#fff'
    },
    avatar: {
        marginBottom: 40,
        alignSelf: 'center'
    },
    button: {
        marginBottom: 20
    },
    form: {
        marginVertical: 20,
        flex: 1,
        justifyContent: 'center'
    },
    inputContainer: {
        marginBottom: 20,
        paddingHorizontal: 0
    },
    inputLabel: {
        textTransform: 'uppercase'
    },
    signOutButton: {
        marginTop: 'auto',
        paddingTop: 20
    }
});
