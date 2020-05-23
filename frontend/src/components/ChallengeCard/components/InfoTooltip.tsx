import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Tooltip } from 'react-native-elements';

export const InfoTooltip: React.FC<{ text: string, width?: number }> = props => (
    <Tooltip
        containerStyle={styles.tooltip}
        backgroundColor='#fff'
        withOverlay={false}
        pointerColor='#e6e6e6'
        width={props.width}
        popover={<Text>{props.text}</Text>}
    >
        {props.children}
    </Tooltip>
);

const styles = StyleSheet.create({
    tooltip: {
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        borderRadius: 4
    }
});
