import React from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons'
import { Card, Text } from 'react-native-elements';
import { Challenge } from '../../models';
import { getFormattedDateString } from '../../helpers/date.helper';
import { VersusIcon } from './images/versus';

interface ChallengeCardProps {
    challenge: Challenge;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
    return (
        <Card containerStyle={styles.container}>
            <View style={styles.participantsContainer}>
                <View style={styles.participant}>
                    <Image
                        style={styles.avatar}
                        source={{ uri: challenge.createdBy.avatar }}
                    />

                    <Text style={styles.creatorName}>{challenge.createdBy.username}</Text>
                </View>

                <Image
                    style={styles.versus}
                    source={{ uri: VersusIcon }}
                />

                <View style={styles.participant}>
                    <Image
                        style={styles.avatar}
                        source={{}}
                    />

                    <Text style={styles.opponentName}>Dare him</Text>
                </View>
            </View>

            <View style={styles.info}>
                <Text style={styles.infoText}>{challenge.description}</Text>
                <Text style={styles.infoText}>{challenge.bid}</Text>
                <Text style={styles.infoText}>Due Date {getFormattedDateString(new Date(challenge.endDate))}</Text>
            </View>

            <View style={styles.toolbar}>
                <TouchableOpacity style={{ marginRight: 16 }}>
                    <Ionicons name={Platform.OS === 'ios' ? 'ios-heart-empty' : 'md-heart-empty'} size={24} />
                </TouchableOpacity>

                <TouchableOpacity>
                    <Octicons style={{ marginTop: 2 }} name='comment' size={22} />
                </TouchableOpacity>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 0,
        marginBottom: 8
    },
    participantsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    participant: {
        alignItems: 'center'
    },
    creatorName: {
        color: 'green',
        fontWeight: '500'
    },
    opponentName: {
        color: 'tomato',
        fontWeight: '500'
    },
    avatar: {
        marginBottom: 4,
        width: 80,
        height: 80,
        borderRadius: 40
    },
    versus: {
        marginHorizontal: 16,
        alignSelf: 'flex-start',
        width: 80,
        height: 80
    },
    info: {},
    infoText: {},
    toolbar: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center'
    }
});
