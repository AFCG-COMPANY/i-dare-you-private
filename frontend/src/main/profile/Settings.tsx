import React from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import * as firebase from 'firebase';
import { Button, Input, Text } from 'react-native-elements';

import { Avatar } from '../../components';
import { blobToBase64, updateUserInfo } from '../../api';
import { AppActionTypes, AppContext } from '../../contexts/AppContext';
import { User } from '../../models';

interface SettingsProps {
}

export const Settings: React.FC<SettingsProps> = ({}) => {
    const { state, dispatch } = React.useContext(AppContext);
    const { user } = state;

    if (!user) {
        return <ActivityIndicator size='large'/>;
    }

    const [error, setError] = React.useState<string | null>(null);
    const [usernameValue, setUsernameValue] = React.useState(user.username);
    const [bioValue, setBioValue] = React.useState(user.bio);
    const [avatarValue, setAvatarValue] = React.useState<string>();
    const [updateInProgress, setUpdateInProgress] = React.useState<boolean>(false);

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
                quality: 0
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

        try {
            const updatedUser: User = {
                id: user.id,
                username: usernameValue,
                bio: bioValue
            };

            if (avatarValue) {
                // User selected new avatar, need to upload it
                const res = await fetch(avatarValue);
                const blob = await res.blob();
                // await storageRef.child(avatarPath).delete();
                await storageRef.child(avatarPath).put(blob);
                updatedUser.avatar = await blobToBase64(blob);
            } else {
                updatedUser.avatar = user.avatar;
            }
            await updateUserInfo(updatedUser);
            dispatch({ type: AppActionTypes.SetUser, payload: updatedUser });
        } catch (e) {
            console.log(e);
            Alert.alert('Failed to update profile. Try again.');
        } finally {
            setUpdateInProgress(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.form}
            behavior='padding'
        >
            <ScrollView
                style={styles.container}
                keyboardShouldPersistTaps='handled'
                bounces={false}
            >
                <Avatar
                    containerStyle={styles.avatar}
                    source={{ uri: avatarValue || user.avatar }}
                    onEditPress={onAvatarEditPress}
                />
                <Input
                    containerStyle={styles.inputContainer}
                    label='Display Name'
                    labelStyle={styles.inputLabel}
                    autoCapitalize='none'
                    value={usernameValue}
                    onFocus={() => setError(null)}
                    onChangeText={value => setUsernameValue(value)}
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
                    containerStyle={styles.button}
                    title='Update Profile'
                    loading={updateInProgress}
                    onPress={updateProfile}
                />
                {error && <Text style={styles.error}>{error}</Text>}
            </ScrollView>
        </KeyboardAvoidingView>
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
        flex: 1
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