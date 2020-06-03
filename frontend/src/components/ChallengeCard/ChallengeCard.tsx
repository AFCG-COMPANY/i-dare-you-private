import React from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Card, Icon, Text } from 'react-native-elements';
import { Challenge, User } from '../../models';
import { getFormattedDateString } from '../../helpers/date.helper';
import { HealthBar, InfoTooltip, Opponents, ResultImage } from './components';

interface ChallengeCardProps {
    challenge: Challenge;
    onProfilePress?: (user: User) => void;
    onChallengePress?: () => void;
}
export const ChallengeCard: React.FC<ChallengeCardProps> = ({
    challenge,
    onChallengePress,
    onProfilePress,
    children
}) => {
    return (
        <TouchableWithoutFeedback onPress={onChallengePress}>
            <Card containerStyle={styles.card}>
                <View style={styles.participantsContainer}>
                    <View style={styles.participantContainer}>
                        <HealthBar
                            style={styles.healthBar}
                            health={challenge.creatorHealth || 0}
                        />

                        <TouchableOpacity
                            style={styles.participant}
                            onPress={() => onProfilePress && onProfilePress(challenge.createdBy)}
                        >
                            <Image
                                style={styles.avatar}
                                source={{ uri: challenge.createdBy.avatar }}
                            />

                            <Text
                                style={styles.creatorName}
                                numberOfLines={1}
                                ellipsizeMode='middle'
                            >
                                {challenge.createdBy.username}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ResultImage
                        status={challenge.status}
                        result={challenge.result}
                    />

                    <View style={styles.participantContainer}>
                        <HealthBar
                            style={styles.healthBar}
                            health={100 - (challenge.creatorProgress || 0)}
                        />

                        <Opponents
                            containerStyle={styles.participant}
                            opponents={challenge.opponents as User[]}
                            onOpponentPress={onProfilePress}
                        />
                    </View>
                </View>

                <View style={styles.info}>
                    <View style={styles.infoRow}>
                        <InfoTooltip
                            text='Subject of the challenge'
                            width={200}
                        >
                            <Icon
                                containerStyle={{ marginRight: 2 }}
                                type='entypo'
                                name='hair-cross'
                                size={16}
                            />
                        </InfoTooltip>
                        <Text style={styles.infoText}>{challenge.description}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <InfoTooltip text='Bid'>
                            <Icon
                                containerStyle={{marginLeft: -2 }}
                                type='material-community'
                                name='cash-usd'
                                size={20}
                            />
                        </InfoTooltip>
                        <Text style={styles.infoText}>{challenge.bid}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <InfoTooltip text='Due date'>
                            <Icon type='ionicon' name={Platform.OS === 'ios' ? 'ios-calendar' : 'md-calendar'} size={20} />
                        </InfoTooltip>
                        <Text style={styles.infoText}>{getFormattedDateString(new Date(challenge.endDate))}</Text>
                    </View>
                </View>

                <>{children}</>
            </Card>
        </TouchableWithoutFeedback>
    );
};


const styles = StyleSheet.create({
    card: {
        margin: 0,
    },
    participantsContainer: {
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    participantContainer: {
        alignItems: 'center'
    },
    participant: {
        alignItems: 'center'
    },
    creatorName: {
        color: 'green',
        fontWeight: '500',
        maxWidth: 80
    },
    healthBar: {
        marginBottom: 4,
        width: 64,
    },
    avatar: {
        marginBottom: 4,
        width: 80,
        height: 80,
        borderRadius: 40
    },
    info: {
        marginLeft: 2
    },
    infoText: {
        paddingHorizontal: 8,
        alignSelf: 'center'
    },
    infoRow: {
        marginTop: 4,
        flexDirection: 'row'
    }
});
