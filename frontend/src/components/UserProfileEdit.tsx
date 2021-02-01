import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    View,
    Linking
} from 'react-native';
import { Notifications } from 'expo';
import { Button, Input, Text } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import * as firebase from 'firebase';

import { AppActionTypes, AppContext } from '../contexts/AppContext';
import { User } from '../models';
import { blobToBase64, updateUser } from '../api/user';
import { Avatar } from './Avatar';

interface UserProfileEditProps {
    updateButtonTitle?: string;
    onSuccess?: () => void;
}

export const UserProfileEdit: React.FC<UserProfileEditProps> = (props) => {
    useEffect(() => {
        notification();
    }, []);

    const notification = async () => {
        if (!user?.username){
            console.log(123);
            console.log(user?.id)
            const [status, token] = await getNotificationToken();
            console.log(status, token);
            setUserStatus(status);
            setUserToken(token);
        }
    }

    const { state, dispatch } = React.useContext(AppContext);
    const { user } = state;

    if (!user) {
        return <ActivityIndicator size='large' />;
    }

    const [error, setError] = React.useState<string | null>(null);
    const [usernameValue, setUsernameValue] = React.useState(user.username);
    const [bioValue, setBioValue] = React.useState(user.bio);
    const [avatarValue, setAvatarValue] = React.useState<string>();
    const [updateInProgress, setUpdateInProgress] = React.useState<boolean>(
        false
    );
    const [userStatus, setUserStatus] = useState('');
    const [userToken, setUserToken] = useState('');

    const onAvatarEditPress = async () => {
        // Get permission to access photos
        if (Constants.platform?.ios) {
            const { status } = await Permissions.askAsync(
                Permissions.CAMERA_ROLL
            );

            if (status !== 'granted') {
                Alert.alert(
                    'Sorry, we need camera roll permissions to make this work!'
                );
                return;
            }
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                aspect: [4, 3],
                quality: 1
            });

            if (!result.cancelled) {
                setAvatarValue(result.uri);
            }
        } catch (e) {
            Alert.alert('Failed to upload photo. Please try again.');
            console.log(e);
        }
    };

    const updateProfile = async () => {
        if (!usernameValue) {
            setError('Display name is required.');
            return;
        }

        setUpdateInProgress(true);

        const storageRef = firebase.storage().ref();
        const avatarPath = 'avatars/' + user.id;

        const updatedUser: User = {
            ...user,
            username: usernameValue,
            bio: bioValue
        };

        try {
            if (avatarValue) {
                // User selected new avatar, need to upload it
                const res = await fetch(avatarValue);
                const blob = await res.blob();
                await storageRef.child(avatarPath).put(blob);

                // Need to send download url to backend
                updatedUser.avatar = await storageRef
                    .child(avatarPath)
                    .getDownloadURL();

                // We also need to store base64 formatted avatar to avoid unnecessary network requests
                updatedUser.avatarBase64 = await blobToBase64(blob);
            }
            console.log(userStatus, userToken);
            await updateUser(updatedUser, userStatus, userToken);

            setUpdateInProgress(false);

            // Update global state with user info
            dispatch({
                type: AppActionTypes.SetUser,
                payload: updatedUser
            });

            props.onSuccess && props.onSuccess();
        } catch (e) {
            console.log(e);
            Alert.alert('Failed to update profile. Try again.');
            setUpdateInProgress(false);
        }
    };

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            bounces={false}
            enableOnAndroid={true}
        >
            <Avatar
                containerStyle={styles.avatar}
                source={{ uri: avatarValue || user.avatarBase64 }}
                onEditPress={onAvatarEditPress}
            />

            <Input
                containerStyle={styles.inputContainer}
                label='User Name'
                labelStyle={styles.inputLabel}
                autoCapitalize='none'
                value={usernameValue}
                onFocus={() => setError(null)}
                onChangeText={(value) => setUsernameValue(value)}
            />

            <Input
                containerStyle={styles.inputContainer}
                label='Bio'
                labelStyle={styles.inputLabel}
                autoCapitalize='none'
                value={bioValue}
                onChangeText={(value) => setBioValue(value)}
            />

            <Button
                containerStyle={styles.button}
                title={props.updateButtonTitle || 'Update Profile'}
                loading={updateInProgress}
                onPress={updateProfile}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <View
                style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    marginTop: 40
                }}
            >
                <Text
                    style={{
                        color: '#0088cc',
                        textAlign: 'center',
                        fontSize: 16,
                        marginTop: 'auto'
                    }}
                    onPress={() => Linking.openURL('https://t.me/AnteOfficial')}
                >
                    OUR TELEGRAM CHANNEL
                </Text>
            </View>
        </KeyboardAwareScrollView>
    );
};

const getNotificationToken = async () => {
    const token = await Notifications.getExpoPushTokenAsync();

    console.log(token);
    Notifications.createChannelAndroidAsync('chat-messages', {
        name: 'Chat messages',
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
    });

    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );

    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        console.log('ask');
        const { status } = await Permissions.askAsync(
            Permissions.NOTIFICATIONS
        );
        finalStatus = status;
    }

    return [finalStatus, token];
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 40,
        flex: 1,
        backgroundColor: '#fff'
    },
    avatar: {
        alignSelf: 'center',
        marginBottom: 32
    },
    button: {
        marginTop: 20
    },
    inputContainer: {
        marginBottom: 20,
        paddingHorizontal: 0
    },
    inputLabel: {
        textTransform: 'uppercase'
    },
    error: {
        alignSelf: 'center',
        color: 'tomato'
    }
});
