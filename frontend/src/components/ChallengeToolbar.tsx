import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';

interface ChallengeToolbarProps {
    liked: boolean;
    likesCount: number;
    onCommentPress?: () => void;
    onLikePress?: () => void;
}

export const ChallengeToolbar: React.FC<ChallengeToolbarProps> = (props) => (
    <View style={styles.toolbar}>
        <TouchableOpacity
            style={styles.likeButton}
            onPress={props.onLikePress}
        >
            {props.liked
                ? (
                    <Icon
                        type='ionicon'
                        name={Platform.OS === 'ios' ? 'ios-heart' : 'md-heart'}
                        color='#e92f3c'
                        size={22}
                    />
                )
                : (
                    <Icon
                        type='ionicon'
                        name={Platform.OS === 'ios' ? 'ios-heart-empty' : 'md-heart-empty'}
                        size={22}
                    />
                )
            }

            {props.likesCount > 0 && <Text style={styles.likesCount}>{props.likesCount}</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={props.onCommentPress}>
            <Icon type='octicon' name='comment' size={22}/>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    toolbar: {
        paddingHorizontal: 2,
        flexDirection: 'row',
        alignItems: 'center'
    },
    likeButton: {
        marginRight: 20,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center'
    },
    likesCount: {
        position: 'absolute',
        left: 21,
        top: 3
    }
});
