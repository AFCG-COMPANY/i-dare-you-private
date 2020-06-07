import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';

interface ChallengeToolbarProps {
    liked: boolean;
    likesCount: number;
    commentsCount: number;
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

        <TouchableOpacity style={styles.commentButton} onPress={props.onCommentPress}>
            <Icon type='octicon' name='comment' size={22} />
            {props.commentsCount > 0 && <Text style={styles.commentsCount}>{props.commentsCount}</Text>}
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
        top: Platform.OS == 'ios' ? 3 : 1
    },
    commentButton: {
        position: 'relative'
    },
    commentsCount: {
        position: 'absolute',
        left: 26,
        top: Platform.OS == 'ios' ? 3 : 1
    }
});
