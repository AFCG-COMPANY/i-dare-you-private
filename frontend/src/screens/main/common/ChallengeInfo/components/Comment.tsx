import React from 'react';
import {
    View,
    Modal,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

interface CommentProps {
    user: string;
    message: string | undefined;
    imageUrl: string | undefined;
    id: number;
}

export const CommentComponent: React.FC<CommentProps> = ({
    user,
    message,
    imageUrl,
    id
}) => {
    const [isModelVisible, setIsModelVisible] = React.useState<boolean>(false);
    return (
        <View style={styles.comment} key={id}>
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
    comment: {
        marginBottom: 12,
        fontSize: 14
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
