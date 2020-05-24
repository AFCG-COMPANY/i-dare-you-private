import React from 'react';
import { User } from '../../../models';
import { Image, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-elements';
import { DefaultOpponentAvatar } from '../images/default-opponent-avatar';

interface OpponentsProps {
    opponents: User[];
    onOpponentPress?: (opponent: User) => void;
    containerStyle?: StyleProp<ViewStyle>;
}
export const Opponents: React.FC<OpponentsProps> = props => {
    const opponents = props.opponents;
    const layout = generateAvatarsLayout(opponents.length);

    let content;
    if (opponents.length) {
        content = (<>
            <View style={styles.deck}>
                {layout.map((cell, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            position: 'absolute',
                            left: cell.left,
                            top: cell.top
                        }}
                        onPress={() => props.onOpponentPress && props.onOpponentPress(opponents[index])}
                    >
                        <Image
                            style={{
                                width: cell.size,
                                height: cell.size,
                                borderRadius: cell.size / 2
                            }}
                            source={{ uri: opponents[index].avatar }}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.name}>
                {opponents[0].username}
                {opponents.length - 1 > 0 && ` + ${opponents.length - 1}`}
            </Text>
        </>);
    } else {
        content = (<>
            <View style={styles.defaultAvatarContainer}>
                <Image
                    style={styles.defaultAvatar}
                    source={{ uri: DefaultOpponentAvatar }}
                />
            </View>
            <Text style={styles.name}>No opponents</Text>
        </>);
    }

    return (
        <View style={props.containerStyle}>
            {content}
        </View>
    );
};

const AVATAR_SIZE = 80;
const AVATAR_BORDER_RADIUS = AVATAR_SIZE / 2;
const AVATAR_OFFSET = 7;

const generateAvatarsLayout = (opponentsCount: number) => {
    const result: {size: number, left: number, top: number}[] = [];
    let size: number;

    switch (opponentsCount) {
        case 1:
            result.push({ size: AVATAR_SIZE, left: 0, top: 0 });
            break;

        case 2:
            size = AVATAR_SIZE / 2 + 2 * AVATAR_OFFSET;
            const offset = size - 4 * AVATAR_OFFSET;

            result.push({ size, left: 0, top: 0 });
            result.push({ size, left: offset, top: offset });
            break;

        case 3:
            size = AVATAR_SIZE / 3 + 2 * AVATAR_OFFSET;
            for (let i = 0; i < 3; i++) {
                const offset = i * (AVATAR_SIZE / 3 - AVATAR_OFFSET);
                result.push({ size, left: offset, top: offset });
            }
            break;

        case 4:
            size = AVATAR_SIZE / 2;
            result.push({ size, left: 0, top: 0 });
            result.push({ size, left: size, top: 0 });
            result.push({ size, left: 0, top: size });
            result.push({ size, left: size, top: size });
            break;

        case 5:
        default:
            size = AVATAR_SIZE / 2;
            result.push({ size, left: 0, top: 0 });
            result.push({ size, left: size, top: 0 });
            result.push({ size, left: 0, top: size });
            result.push({ size, left: size, top: size });
            result.push({ size, left: AVATAR_SIZE / 4, top: AVATAR_SIZE / 4 });
    }

    return result;
};

const styles = StyleSheet.create({
    deck: {
        width: 80,
        height: 80,
        position: 'relative'
    },
    singleAvatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_BORDER_RADIUS
    },
    defaultAvatarContainer: {
        alignSelf: 'center',
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_BORDER_RADIUS,
        backgroundColor: 'lightgray',
        justifyContent: 'center'
    },
    defaultAvatar: {
        alignSelf: 'center',
        width: 70,
        height: 70,
        borderRadius: 35
    },
    name: {
        alignSelf: 'center',
        color: 'tomato'
    }
});
