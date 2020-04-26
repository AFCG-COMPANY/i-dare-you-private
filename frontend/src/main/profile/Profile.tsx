import React from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import * as firebase from 'firebase';
import { getUserInfo } from '../../api';
import { User } from '../../models/user';

interface ProfileProps {}

export const Profile: React.FC<ProfileProps> = ({}) => {
    const [ user, setUser ] = React.useState<User>()

    React.useEffect(() => {
        const userId = firebase.auth().currentUser?.uid;

        getUserInfo(userId)
            .then(data => setUser(data))
            .catch(e => {
                Alert.alert('Check Internet connection and try again.')
            });

    }, []);

    if (user) {
        const { avatar, bio, username } = user;

        return (
            <View>
                <Avatar
                    rounded
                    size='large'
                    source={{ uri: avatar }}
                />

                <Text>{username}</Text>

                <Text>{bio}</Text>
            </View>
        );
    } else {
        return <ActivityIndicator size='large' />
    }
};
