import React from 'react';
import {
    View,
    Modal,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Platform
} from 'react-native';
import { Button } from 'react-native-elements';
import ImageViewer from 'react-native-image-zoom-viewer';

interface CommentProps {
    user: string;
    userId: string;
    message: string | undefined;
    imageUrl: string | undefined;
    id: number;
    setReplayToUser: any;
}

export const CommentComponent: React.FC<CommentProps> = ({
    user,
    userId,
    message,
    imageUrl,
    id,
    setReplayToUser
}) => {
    const [isModelVisible, setIsModelVisible] = React.useState<boolean>(false);
    return (
        <View style={styles.comment} key={id}>
            <Button
                buttonStyle={{
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    right:     0,
                    top:      0,
                }}
                icon={{
                    type: 'ionicon',
                    name: Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward',
                    size: 28,
                    color: '#007ef5'
                }}
                onPress={() => {
                    setReplayToUser(user, userId);
                }}
            />
            <Text style={styles.commentAuthor}>{user}</Text>
            <Text style={styles.commentText}>{message}</Text>
            {imageUrl && (
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                        setIsModelVisible(true);
                    }}
                >
                    <Image style={styles.tinyLogo} source={{ uri: imageUrl }} />
                </TouchableOpacity>
            )}
            <Modal
                visible={isModelVisible}
                transparent={true}
                onRequestClose={() => setIsModelVisible(false)}
            >
                <ImageViewer
                    imageUrls={[
                        {
                            url: imageUrl,
                            props: {
                                enableImageZoom: true,
                                renderFooter: false,
                                saveToLocalByLongPress: false
                            }
                        }
                    ]}
                />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    reply: {
        position: 'absolute',
        left:     0,
        top:      0,
    },
    comment: {
        marginBottom: 12,
        fontSize: 14,
    },
    commentAuthor: {
        fontSize: 14,
        fontWeight: '600',
        width: '30%'
    },
    commentText: {
        paddingLeft: 16,
        width: '90%'
    },
    tinyLogo: {
        width: 50,
        height: 50
    }
});
