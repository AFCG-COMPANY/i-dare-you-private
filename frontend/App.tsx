import React, { useState, useEffect, useRef } from 'react';
import Root from './src/Root';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { cos } from 'react-native-reanimated';

export default function App() {
    useEffect(() => {
        notification();
    }, []);

    return <Root />;
}

const notification = async () => {
    const token = await Notifications.getExpoPushTokenAsync();

    alert(token);
    Notifications.createChannelAndroidAsync('chat-messages', {
        name: 'Chat messages',
        sound: true
    });

    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(
            Permissions.NOTIFICATIONS
        );
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return;
    }

    await persistToken();
};

const persistToken = async () => {
    try {
        const token = await Notifications.getExpoPushTokenAsync();

        console.log(token);
    } catch (err) {
        throw err;
    }
};
