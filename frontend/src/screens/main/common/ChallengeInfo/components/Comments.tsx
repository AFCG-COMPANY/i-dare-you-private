import React from 'react';
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    View,
    Alert,
    Modal,
    Image,
    TouchableOpacity
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Button, Input, Text } from 'react-native-elements';
import { Comment } from '../../../../../models/challenge';
import { CommentComponent } from './Comment';

interface CommentsProps {
    loading: boolean;
    comments: Comment[];
    onPost: (message: string, imageUrl: string) => void;
    shouldFocusInput?: boolean;
}
export const Comments: React.FC<CommentsProps> = ({
    comments,
    onPost,
    shouldFocusInput,
    loading
}) => {
    const [message, setMessage] = React.useState<string>('');
    const [imageUrl, setImageUrl] = React.useState<string>('');
    const [isModelVisible, setIsModelVisible] = React.useState<boolean>(false);
    const inputRef = React.useRef<Input>(null);

    React.useEffect(() => {
        shouldFocusInput && inputRef.current?.focus();
    }, [shouldFocusInput]);

    const uploadPhoto = async () => {
        // Get permission to access photos
        if (Constants.platform?.ios) {
            const { status } = await Permissions.askAsync(
                Permissions.CAMERA_ROLL
            );

            if (status !== 'granted') {
                Alert.alert(
                    'Sorry, we need camera roll permissions to make this work!'
                );
                return;
            }
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                aspect: [4, 3],
                quality: 1
            });

            if (!result.cancelled) {
                setImageUrl(result.uri);
            }
        } catch (e) {
            Alert.alert('Failed to upload photo. Please try again.');
            console.log(e);
        }
    };

    return (
        <>
            {loading ? (
                <ActivityIndicator size='small' />
            ) : (
                comments.map((comment, id) => (
                    <CommentComponent
                        user={comment.user.username}
                        message={comment.message}
                        imageUrl={comment.imageUrl}
                        id={id}
                    />
                ))
            )}

            <View style={{ flexDirection: 'row' }}>
                <Button
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    icon={{
                        type: 'ionicon',
                        name:
                            Platform.OS === 'ios' ? 'ios-attach' : 'md-attach',
                        size: 28,
                        color: '#007ef5'
                    }}
                    onPress={async () => {
                        await uploadPhoto();
                    }}
                />
                <Input
                    ref={inputRef}
                    containerStyle={{ flex: 1, paddingLeft: 0 }}
                    placeholder='Add a comment...'
                    inputStyle={{ fontSize: 14 }}
                    value={message}
                    onChangeText={setMessage}
                />
                <Button
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    icon={{
                        type: 'ionicon',
                        name: Platform.OS === 'ios' ? 'ios-send' : 'md-send',
                        size: 28,
                        color: '#007ef5'
                    }}
                    onPress={() => {
                        onPost(message, imageUrl);
                        setMessage('');
                        setImageUrl('');
                    }}
                />
            </View>
            {imageUrl !== '' && (
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
        </>
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
        width: '70%'
    },
    tinyLogo: {
        width: 50,
        height: 50
    }
});
