import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface HealthBarProps {
    health: number;
    max?: number;
    style?: StyleProp<ViewStyle>
}

export const HealthBar: React.FC<HealthBarProps> = props => {
    const max = props.max || 100;
    const healthPercentage = Math.round(props.health * 100 / max);

    return (
        <View
            style={StyleSheet.flatten([
                props.style,
                styles.bar
            ])}
        >
            <View
                style={{
                    backgroundColor: '#00c851',
                    width: healthPercentage + '%'
                }}
            >
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        backgroundColor: '#e52b50',
        height: 4
    }
});
