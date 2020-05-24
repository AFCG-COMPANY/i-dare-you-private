import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';

interface ChallengeToolbarProps {
    liked: boolean;
    likedBy: string[];
    onCommentPress?: () => void;
    onLikePress?: () => void;
}

export const ChallengeToolbar: React.FC<ChallengeToolbarProps> = (props) => (
    <View style={styles.toolbar}>
        <TouchableOpacity
            style={{ marginRight: 16 }}
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

            {props.likedBy.length > 0 && <Text>{props.likedBy.length}</Text>}
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
    }
});
