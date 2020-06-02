import React from 'react';
import { View, Slider } from 'react-native';
import { Button, Input, Overlay, Text } from 'react-native-elements';
import { ChallengeStatus } from '../../../../../models/challenge';

export type ActionsLoadingType = 'end' | 'setProgress' | 'join' | 'voteSuccess' | 'voteFail' | null;

interface ActionsProps {
    loading: ActionsLoadingType;
    isCreator: boolean;
    isOpponent: boolean;
    status: ChallengeStatus;
    creatorProgress?: number;
    creatorVote?: boolean;
    onProgressChangePress: (progress: number) => void;
    onEndChallengePress: () => void;
    onMakeBidPress: (bid: string) => void;
    onVotePress: (goalAccomplished: boolean) => void;
}

interface ActionsState {
    finishOverlayVisible: boolean;
    progressSliderValue: number;
    bidError?: string;
    bid?: string;
}

export class Actions extends React.Component<ActionsProps, ActionsState> {
    state: ActionsState = {
        finishOverlayVisible: false,
        progressSliderValue: this.props.creatorProgress || 0
    };

    toggleFinishOverlay = () => this.setState({ finishOverlayVisible: !this.state.finishOverlayVisible });

    onEndChallengePress = () => {
        this.toggleFinishOverlay();
        this.props.onEndChallengePress();
    };

    onProgressSliderValueChange = (value: number) => {
        this.setState({ progressSliderValue: value });
    };

    onMakeBidPress = async () => {
        if (this.state.bid) {
            this.props.onMakeBidPress(this.state.bid);
        } else {
            this.setState({ bidError: 'You must specify your bid.' });
        }
    };

    onVotePress = (goalAccomplished: boolean) => {
        this.props.onVotePress(goalAccomplished);
    }

    render() {
        switch (this.props.status) {
            case ChallengeStatus.Created:
            case ChallengeStatus.InProgress:
                if (this.props.isOpponent) {
                    return <Text>You are already participating in this challenge.</Text>;
                } else if (this.props.isCreator) {
                    return <>
                        <Text>
                            Set your current progress:
                            <Text style={{ fontWeight: 'bold' }}> {this.state.progressSliderValue}%</Text>
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>0</Text>
                            <Slider
                                style={{ flex: 1, marginHorizontal: 8 }}
                                maximumValue={100}
                                minimumValue={0}
                                step={1}
                                value={this.state.progressSliderValue}
                                onValueChange={this.onProgressSliderValueChange}
                            />
                            <Text>100</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Button
                                containerStyle={{ marginTop: 16 }}
                                loading={this.props.loading === 'end'}
                                type='clear'
                                title='End the Challenge'
                                titleStyle={{ fontSize: 16 }}
                                onPress={this.toggleFinishOverlay}
                            />

                            <Button
                                containerStyle={{ width: 92 }}
                                loading={this.props.loading === 'setProgress'}
                                title='Apply'
                                onPress={() => this.props.onProgressChangePress(this.state.progressSliderValue)}
                            />
                        </View>

                        <Overlay
                            overlayStyle={{ width: 280, height: 200, padding: 20 }}
                            isVisible={this.state.finishOverlayVisible}
                            animationType='fade'
                            onBackdropPress={this.toggleFinishOverlay}
                        >
                            <>
                                <Text h3>Caution</Text>
                                <Text style={{ marginTop: 16, marginBottom: 32 }}>
                                    Are you sure you want to finish the challenge before the due date?
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Button
                                        containerStyle={{ width: 80 }}
                                        title='No'
                                        onPress={this.toggleFinishOverlay}
                                    />
                                    <Button
                                        containerStyle={{ width: 80 }}
                                        type='outline'
                                        title='Yes'
                                        onPress={this.onEndChallengePress}
                                    />
                                </View>
                            </>
                        </Overlay>
                    </>;
                } else {
                    return <>
                            <Input
                                containerStyle={{ marginBottom: 20 }}
                                errorMessage={this.state.bidError}
                                errorStyle={{ marginHorizontal: 0 }}
                                inputStyle={{ maxHeight: 100 }}
                                inputContainerStyle={{ borderBottomColor: this.state.bidError && 'red' }}
                                multiline={true}
                                autoCorrect={false}
                                placeholder='$100'
                                value={this.state.bid}
                                onChangeText={bid => this.setState({ bid })}
                            />

                            <Button
                                containerStyle={{ alignSelf: 'flex-end', width: 128 }}
                                loading={this.props.loading === 'join'}
                                title='Make the Bid'
                                onPress={this.onMakeBidPress}
                            />
                        </>;
                }

            case ChallengeStatus.Voting:
                if (this.props.isOpponent || this.props.isCreator) {
                    let vote;
                    if (this.props.isCreator) {
                        vote = this.props.creatorVote;
                    } else {

                    }

                    return (
                        <>
                            {vote != null && <Text style={{ marginBottom: 16 }}>You voted for:
                                <Text style={{ fontWeight: '600' }}>
                                    {vote ? ' Goal Achieved' : ' Goal not Reached'}
                                </Text>
                            </Text>}

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Button
                                    containerStyle={{ width: '40%' }}
                                    buttonStyle={{ backgroundColor: '#00c851', height: 62 }}
                                    title='Goal Achieved'
                                    titleStyle={{ color: 'white', fontWeight: '600' }}
                                    loading={this.props.loading === 'voteSuccess'}
                                    onPress={() => this.onVotePress(true)}
                                />
                                <Button
                                    containerStyle={{ width: '40%' }}
                                    buttonStyle={{ backgroundColor: '#e52b50', height: 62 }}
                                    title='Goal not Reached'
                                    titleStyle={{ color: 'white', fontWeight: '600' }}
                                    loading={this.props.loading === 'voteFail'}
                                    onPress={() => this.onVotePress(false)}
                                />
                            </View>
                        </>
                    );
                } else {
                    return <Text>The challenge is in voting phase.</Text>
                }

            case ChallengeStatus.Finished:
                return <Text>Challenge ended.</Text>;

            default:
                console.log('Incorrect challenge status');
                return null;
        }
    }
}
