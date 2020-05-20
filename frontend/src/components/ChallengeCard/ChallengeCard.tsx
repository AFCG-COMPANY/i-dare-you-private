import React from 'react';
import {
    Image,
    Platform,
    StyleProp,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity, TouchableWithoutFeedback,
    View,
    ViewStyle
} from 'react-native';
import { Card, Divider, Icon, Text, Tooltip } from 'react-native-elements';
import { Challenge, User } from '../../models';
import { getFormattedDateString } from '../../helpers/date.helper';
import { VersusIcon } from './images/versus';
import { DefaultOpponentAvatar } from './images/default-opponent-avatar';

interface ChallengeCardProps {
    challenge: Challenge;
}

/**
 * TODO
 * 1. Single opponent view
 * 2. Opponents stack view
 * 3. Progress bars
 * 4. Challenge status images (Win, Lose)
 * 5. Like/Undo Like
 * 6. Comments/Tap on Card => navigation to Challenge Screen
 * 7. Navigation to Profile
 * 8. Vote button
 */

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
    return (
        <Card containerStyle={styles.container}>
            {/*TODO*/}
            <TouchableOpacity onPress={() => console.log('navigate to challenge view')}>
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

                    <TouchableOpacity>
                        <Icon type='octicon' name='comment' size={22} />
                        {/*TODO comments*/}
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Card>
    );
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
                {props.opponents?.map(user => (
                    <Image
                        style={styles.avatar}
                        source={{}}
                    />
                ))}

                <Text style={styles.opponentName}>Dare him</Text>
            </View>
        );
    } else {
        return (
            <View style={{ alignItems: 'center' }}>
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
    avatar: {
        marginBottom: 4,
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
    }
});
