import React, { useState, useEffect, useRef } from 'react';
import Root from './src/Root';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { cos } from 'react-native-reanimated';

export default function App() {
    return <Root />;
}

