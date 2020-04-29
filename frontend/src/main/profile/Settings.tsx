import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import * as firebase from 'firebase';
import { Button, Input, Text } from 'react-native-elements';

import { DismissKeyboardView } from '../../components';
import { updateUserInfo } from '../../api';
import { AppActionTypes, AppContext } from '../../contexts/AppContext';
import { User } from '../../models';

interface SettingsProps {}

export const Settings: React.FC<SettingsProps> = ({}) => {
    const { state, dispatch } = React.useContext(AppContext);
    const { user } = state;

    if (!user) {
        return <ActivityIndicator size='large' />;
    }

    const [ error, setError ] = React.useState<string | null>(null);
    const [ usernameValue, setUsernameValue ] = React.useState(user.username);
    const [ bioValue, setBioValue ] = React.useState(user.bio);
    const [ avatarUri, setAvatarUri ] = React.useState<string>();

    React.useEffect(() => {
        // Fetch initial user avatar from storage
        firebase.storage().ref('avatars/default.jpeg').getDownloadURL()
            .then(avatarUrl => setAvatarUri(avatarUrl))
            .catch(e => {
                setAvatarUri('avatars/default.jpeg');
                console.log(e);
            });
    }, []);

    const onAvatarEditPress = async () => {
        // Get permission to access photos
        if (Constants.platform?.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            if (status !== 'granted') {
                Alert.alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: .7
            });

            if (!result.cancelled) {
                setAvatarUri(result.uri);
            }
        } catch (e) {
            Alert.alert('Failed to upload photo. Please try again.');
        }
    };

    const uploadAvatar = async (userId: string, photoUri: string) => {
        console.log('UPLOAD', userId, photoUri)

        try {
            // Get file blob
            const result = await fetch(photoUri);
            const blob = await result.blob();

            const storageRef = firebase.storage().ref();

            // TODO
            const path = `avatars${userId}`
        } catch (e) {
            Alert.alert('Failed to update profile.');
        }
    };

    // const savePhoto = async () => {
    //     if (avatar) {
    //         const splitedPhotoPath = avatar.split('.');
    //         const photoExtension = splitedPhotoPath[splitedPhotoPath.length - 1];
    //         const result = await fetch(avatar);
    //         const blob = await result.blob();
    //         const storageRef = firebase.storage().ref();
    //
    //         try {
    //             const path: string = `avatars/${user.id}.${photoExtension}`
    //
    //             await storageRef
    //                 .child(path)
    //                 .delete()
    //
    //             await storageRef
    //                 .child(path)
    //                 .put(blob, { contentType: `image/${photoExtension}` })
    //         } catch (e) {
    //             Alert.alert('Failed to upload info. Please try again.')
    //             console.log(e);
    //         }
    //     }
    // };

    const updateProfile = async () => {
        // TODO Add validation

        if (!usernameValue) {
            setError('Display name is required.')
            return;
        }

        const updatedUser: User = {
            id: user.id,
            username: usernameValue,
            bio: bioValue
        };

        try {
            await updateUserInfo(updatedUser);
            dispatch({type: AppActionTypes.SetUser, payload: updatedUser})
        } catch (e) {
            Alert.alert('Failed to update profile. Try again.')
        }
    };

    return (
        <DismissKeyboardView style={styles.container}>
            <View style={styles.form}>
                {/*<Avatar*/}
                {/*    containerStyle={styles.avatar}*/}
                {/*    showEditButton={true}*/}
                {/*    onEditPress={onAvatarEditPress}*/}
                {/*    rounded*/}
                {/*    size='large'*/}
                {/*    source={{ uri: avatarUri }}*/}
                {/*/>*/}

                <Input
                    containerStyle={styles.inputContainer}
                    label='Display Name'
                    labelStyle={styles.inputLabel}
                    autoCapitalize='none'
                    value={usernameValue}
                    onFocus={() => setError(null)}
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
                    onPress={updateProfile}
                />
                {error && <Text style={styles.error}>{error}</Text>}

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
        marginTop: 20
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
    },
    error: {
        alignSelf: 'center',
        color: 'tomato'
    }
});
