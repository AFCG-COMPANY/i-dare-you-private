import React from 'react';
import {
    View,
    Text,
    Alert,
    Image,
    StyleSheet,
    ActivityIndicator
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import * as firebase from 'firebase';
import { Button, Input, Avatar } from 'react-native-elements';

import { DismissKeyboardView } from '../../components';
import { getUserInfo, setUserInfo } from '../../api';
import { User } from '../../models/user';

interface SettingsProps {}

export const Settings: React.FC<SettingsProps> = ({}) => {
    const [user, setUser] = React.useState<
        User | { avatar: string } | { bio: string } | { username: string }
    >();

    React.useEffect(() => {
        getPermissionAsync();
    }, []);

    const getPermissionAsync = async () => {
        const userId = firebase.auth().currentUser?.uid;

        getUserInfo(userId)
            .then((data) => setUser(data))
            .catch((e) => {
                Alert.alert('Check Internet connection and try again.');
            });

        if (Constants?.platform?.ios) {
            const { status } = await Permissions.askAsync(
                Permissions.CAMERA_ROLL
            );
            if (status !== 'granted') {
                alert(
                    'Sorry, we need camera roll permissions to make this work!'
                );
            }
        }
    };

    const uriToBlob: (
        uri: string
    ) => Promise<Blob | Uint8Array | ArrayBuffer> = (uri: string) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                // return the blob
                resolve(xhr.response);
            };

            xhr.onerror = function () {
                // something went wrong
                reject(new Error('uriToBlob failed'));
            };
            // this helps us get a blob
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);

            xhr.send(null);
        });
    };

    const selectPhoto = async () => {
        console.log('onChooseImagePress');
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            });
            if (!result.cancelled) {
                setUser({ ...user, avatar: result.uri });
            }
            console.log(result);
        } catch (E) {
            console.log(E);
        }
    };

    const savePhoto = async () => {
        const { avatar, bio, username } = user;
        const splitedPhotoPath = avatar.split('.')
        const photoExtension = splitedPhotoPath[splitedPhotoPath.length - 1]
        const blob = await uriToBlob(avatar);
        let storageRef = firebase.storage().ref();
        storageRef
            .child(`avatars/${firebase.auth().currentUser?.uid}.${photoExtension}`)
            .delete()
            .then(() => {
                console.log('delete photo');
            });
        storageRef
            .child(`avatars/${firebase.auth().currentUser?.uid}.${photoExtension}`)
            .put(blob, {
                contentType: `image/${photoExtension}`
            })
            .then((snapshot) => {
                console.log('success');
            })
            .catch((error) => {
                console.log('err');
            });
    };

    const saveInfo = async () => {
        const { avatar, bio, username } = user;
        if (avatar.startsWith('file')) {
            await savePhoto();
        }
        const avatarPath = `avatars/${firebase.auth().currentUser?.uid}`;
        await setUserInfo(firebase.auth().currentUser?.uid, avatarPath, bio, username);
        console.log(username, bio, avatar);
    };
    if (user) {
        const { avatar, bio, username } = user;
        return (
            <DismissKeyboardView style={styles.container}>
                <View style={styles.form}>
                    <Avatar
                        containerStyle={styles.avatar}
                        rounded
                        size='large'
                        source={{ uri: avatar }}
                    />

                    <Button
                        title='Выбрать фото'
                        containerStyle={styles.button}
                        onPress={selectPhoto}
                    />

                    <Input
                        containerStyle={styles.inputContainer}
                        label='Имя'
                        labelStyle={styles.inputLabel}
                        autoCapitalize='none'
                        value={username}
                        onChangeText={(username) =>
                            setUser({ ...user, username: username })
                        }
                    />

                    <Input
                        containerStyle={styles.inputContainer}
                        label='Описание'
                        labelStyle={styles.inputLabel}
                        autoCapitalize='none'
                        value={bio}
                        onChangeText={(bio) => setUser({ ...user, bio: bio })}
                    />

                    <Button
                        title='Сохранить'
                        containerStyle={styles.button}
                        onPress={saveInfo}
                    ></Button>
                    <Button
                        containerStyle={styles.button}
                        title='Выйти'
                        onPress={() => firebase.auth().signOut()}
                    />
                </View>
            </DismissKeyboardView>
        );
    } else {
        return <ActivityIndicator size='large' />;
    }
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 40,
        flex: 1,
        backgroundColor: '#fff'
    },
    avatar: {
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    errorMessage: {
        marginBottom: 20,
        alignSelf: 'center',
        color: 'tomato',
        fontSize: 16
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
    }
});
