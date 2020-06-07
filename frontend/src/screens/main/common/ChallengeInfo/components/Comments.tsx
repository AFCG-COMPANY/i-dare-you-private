import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { Comment } from '../../../../../models/challenge';

interface CommentsProps {
    loading: boolean;
    comments: Comment[];
    onPost: (message: string) => void;
    shouldFocusInput?: boolean;
}
export const Comments: React.FC<CommentsProps> = ({ comments, onPost, shouldFocusInput, loading }) => {
    const [ message, setMessage ] = React.useState<string>('');
    const inputRef = React.useRef<Input>(null);

    React.useEffect(() => {
        shouldFocusInput && inputRef.current?.focus();
    }, [shouldFocusInput])

    return (
        <>
            {loading
                ? <ActivityIndicator size='small' />
                : comments.map((comment, id) => (
                    <View style={styles.comment} key={id}>
                        <Text style={styles.commentAuthor}>{comment.user.username}</Text>
                        <Text style={styles.commentText}>{comment.message}</Text>
                    </View>
                ))
            }

            <View style={{ flexDirection: 'row' }}>
                <Input
                    ref={inputRef}
                    containerStyle={{ flex: 1, paddingLeft: 0 }}
                    placeholder='Add a comment...'
                    inputStyle={{ fontSize: 14 }}
                    value={message}
                    onChangeText={setMessage}
                />
                <Button
                    buttonStyle={{ backgroundColor: 'transparent', }}
                    icon={{
                        type: 'ionicon',
                        name: Platform.OS === 'ios' ? 'ios-send' : 'md-send',
                        size: 28,
                        color: '#007ef5'
                    }}
                    onPress={() => {
                        onPost(message);
                        setMessage('');
                    }}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    comment: {
        marginBottom: 12,
        fontSize: 14,
        flexDirection: 'row'
    },
    commentAuthor: {
        fontSize: 14,
        fontWeight: '600',
        width: '30%'
    },
    commentText: {
        paddingLeft: 16,
        width: '70%'
    }
});
