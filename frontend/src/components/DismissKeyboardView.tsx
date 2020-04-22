import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';

interface DismissKeyboardProps {
    children: React.ReactNode
}

const withKeyboardDismiss = <P extends object>(
    Component: React.ComponentType<P>
): React.FC<P & DismissKeyboardProps> => ({ children, ...props }: DismissKeyboardProps) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Component {...props as P}>
            {children}
        </Component>
    </TouchableWithoutFeedback>
);

export const DismissKeyboardView = withKeyboardDismiss(View);
