import React from 'react';
import {
    Image,
    ImageBackground,
    Platform,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ViewStyle
} from 'react-native';
import { Card, Divider, Icon, Text, Tooltip } from 'react-native-elements';
import { Challenge, User } from '../../models';
import { getFormattedDateString } from '../../helpers/date.helper';
import { VersusIcon } from './images/versus';
import { DefaultOpponentAvatar } from './images/default-opponent-avatar';
import { HealthBar } from './components/HealthBar';
import { ChallengeResult, ChallengeStatus } from '../../models/challenge';
import { WinIcon } from './images/win';
import { LossIcon } from './images/loss';

interface ChallengeCardProps {
    challenge: Challenge;
    onProfilePress?: (user: User) => void;
    onChallengePress?: () => void;
    onCommentPress?: () => void;
}

/**
 * TODO
 ✅ - Comments/Tap on Card => navigation to Challenge Screen
 ✅ - Navigation to Profile
 * - Single opponent view
 * - Opponents stack view
 * - Like/Undo Like
 * - Vote button
 * TODO Backend integration
 * 1. Progress bars
 * 2. Challenge status images (Win, Lose)
 */

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
    challenge,
    onChallengePress,
    onCommentPress,
    onProfilePress
}) => {
    return (
        <TouchableWithoutFeedback onPress={onChallengePress}>
            <Card containerStyle={styles.container}>
                {/*TODO*/}
                <View style={styles.participantsContainer}>
                    <TouchableOpacity
                        style={styles.participant}
                        onPress={() => onProfilePress && onProfilePress(challenge.createdBy)}
                    >
                        <HealthBar
                            style={styles.healthBar}
                            health={70}
                            max={100}
                        />

                        <Image
                            style={styles.avatar}
                            source={{ uri: challenge.createdBy.avatar }}
                        />

                        <Text style={styles.creatorName}>{challenge.createdBy.username}</Text>
                    </TouchableOpacity>

                    <StatusImage status={challenge.status} />

                    <Opponents
                        containerStyle={styles.participant}
                        opponents={challenge.opponents as User[]}
                    />
                </View>

                <View style={styles.info}>
                    <View style={styles.infoRow}>
                        <InfoTooltip
                            text='Subject of the challenge'
                            width={200}
                        >
                            <Icon containerStyle={{ marginRight: 2 }} type='entypo' name='hair-cross' size={16} />
                        </InfoTooltip>
                        <Text style={styles.infoText}>{challenge.description}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <InfoTooltip text='Bid'>
                            <Icon containerStyle={{marginLeft: -2}}
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

                <Divider style={{ marginVertical: 16 }} />

                <View style={styles.toolbar}>
                    <TouchableOpacity style={{ marginRight: 16 }}>
                        <Icon type='ionicon' name={Platform.OS === 'ios' ? 'ios-heart-empty' : 'md-heart-empty'} size={22} />
                        {challenge.likedBy.length > 0 && <Text>{challenge.likedBy.length}</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onCommentPress}>
                        <Icon type='octicon' name='comment' size={22} />
                    </TouchableOpacity>
                </View>
            </Card>
        </TouchableWithoutFeedback>
    );
};

interface StatusImageProps {
    status: ChallengeStatus;
    result?: ChallengeResult;
}
const StatusImage: React.FC<StatusImageProps> = (props) => {
    if (props.status === ChallengeStatus.Finished) {
        const uri = props.result === ChallengeResult.Win ? WinIcon : LossIcon;

        return (
            <ImageBackground
                style={styles.versus}
                source={{ uri: VersusIcon }}
            >
                <Image
                    style={styles.resultImage}
                    source={{ uri }}
                />
            </ImageBackground>
        );
    } else {
        return (
            <Image
                style={styles.versus}
                source={{ uri: VersusIcon }}
            />
        )
    }
};

const InfoTooltip: React.FC<{ text: string, width?: number }> = props => (
    <Tooltip
        containerStyle={styles.tooltip}
        backgroundColor='#fff'
        withOverlay={false}
        pointerColor='#e6e6e6'
        width={props.width}
        popover={<Text>{props.text}</Text>}
    >
        {props.children}
    </Tooltip>
);

interface OpponentsProps {
    opponents: User[],
    containerStyle?: StyleProp<ViewStyle>
}
const Opponents: React.FC<OpponentsProps> = props => {
    if (props.opponents.length > 1) {
        return null;
    } else if (props.opponents.length === 1) {
        return (
            <View style={props.containerStyle}>
                <HealthBar
                    style={styles.healthBar}
                    health={70}
                />

                {/*{props.opponents?.map(user => (*/}
                {/*    <Image*/}
                {/*        style={styles.avatar}*/}
                {/*        source={{}}*/}
                {/*    />*/}
                {/*))}*/}

                <Text style={styles.opponentName}>Dare him</Text>
            </View>
        );
    } else {
        return (
            <View style={{ alignItems: 'center' }}>
                <HealthBar
                    style={styles.healthBar}
                    health={100}
                />

                <View style={StyleSheet.flatten([styles.avatar, {backgroundColor: 'lightgray', justifyContent: 'center' }])}>
                    <Image
                        style={{ width: 70, height: 70, borderRadius: 35, alignSelf: 'center' }}
                        source={{ uri: DefaultOpponentAvatar }}
                    />
                </View>
                <Text style={styles.opponentName}>No opponents</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        margin: 0,
        marginBottom: 8
    },
    participantsContainer: {
        marginBottom: 12,
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
    healthBar: {
        width: 64,
    },
    avatar: {
        marginVertical: 4,
        width: 80,
        height: 80,
        borderRadius: 40
    },
    defaultAvatar: {
        marginBottom: 4,
        width: 70,
        height: 70,
        borderRadius: 35
    },
    versus: {
        marginHorizontal: 16,
        alignSelf: 'center',
        width: 70,
        height: 70
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
    },
    toolbar: {
        paddingHorizontal: 2,
        flexDirection: 'row',
        alignItems: 'center'
    },
    tooltip: {
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        borderRadius: 4
    },
    resultImage: {
        flex: 1,
        resizeMode: 'contain',
        transform: [{ rotate: '45deg' }]
    }
});
