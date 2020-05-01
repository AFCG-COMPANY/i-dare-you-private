import React from 'react';
import {
    Image,
    ImageProps,
    ImageSourcePropType,
    StyleProp,
    StyleSheet,
    TouchableHighlight,
    View,
    ViewStyle
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface AvatarProps {
    source: ImageSourcePropType;
    onEditPress?: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    imageProps?: ImageProps;
}

export const Avatar: React.FC<AvatarProps> = ({
    onEditPress,
    source,
    imageProps,
    containerStyle
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <Image
                style={styles.image}
                source={source}
                {...imageProps}
            >
            </Image>

            {onEditPress && (
                <TouchableHighlight style={styles.edit} onPress={onEditPress}>
                    <MaterialIcons name='edit' size={20} color='white' />
                </TouchableHighlight>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 100,
        height: 100,
        position: 'relative'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    edit: {
        bottom: 0,
        right: 5,
        position: 'absolute',
        backgroundColor: 'gray',
        width: 30,
        height: 30,
        borderRadius: 15,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
