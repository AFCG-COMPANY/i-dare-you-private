import React from 'react';
import { View, Slider } from 'react-native';
import { Button, Input, Overlay, Text } from 'react-native-elements';
import { ChallengeStatus } from '../../../../../models/challenge';

interface ActionsProps {
    isCreator: boolean;
    isOpponent: boolean;
    status: ChallengeStatus;
    onProgressChangePress: (progress: number) => void;
    onEndChallengePress: () => void;
    onMakeBidPress: (bid: string) => void;
    onVotePress: (goalAccomplished: boolean) => void;
}

interface ActionsState {
    isOpponent: boolean;
    status: ChallengeStatus;
    finishOverlayVisible: boolean;
    progressSliderValue: number;
    bidError?: string;
    bid?: string;
}

export class Actions extends React.Component<ActionsProps, ActionsState> {
    state: ActionsState = {
        isOpponent: this.props.isOpponent,
        status: this.props.status,
        finishOverlayVisible: false,
        progressSliderValue: 0
    };

    toggleFinishOverlay = () => this.setState({ finishOverlayVisible: !this.state.finishOverlayVisible });

    onEndChallengePress = () => {
        this.toggleFinishOverlay();
        this.props.onEndChallengePress();
    };

    onProgressSliderValueChange = (value: number) => {
        this.setState({ progressSliderValue: value });
    };

    onMakeBidPress = () => {
        if (this.state.bid) {
            this.props.onMakeBidPress(this.state.bid);
        } else {
            this.setState({ bidError: 'You must specify your bid.' });
        }
    };

    onVotePress = (goalAccomplished: boolean) => {
        this.props.onVotePress(goalAccomplished);
    }

    componentDidUpdate(prevProps: Readonly<ActionsProps>, prevState: Readonly<ActionsState>, snapshot?: any) {
    }

    render() {
        switch (this.state.status) {
            case ChallengeStatus.Created:
            case ChallengeStatus.InProgress:
                if (this.state.isOpponent) {
                    return <Text>You are already participating in this challenge.</Text>;
                } else if (this.props.isCreator) {
                    return <>
                        <Text>
                            Set your current progress: <
                            Text style={{ fontWeight: 'bold' }}>{this.state.progressSliderValue}%</Text>
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
                                type='clear'
                                containerStyle={{ marginTop: 16 }}
                                title='End the Challenge'
                                titleStyle={{ fontSize: 16 }}
                                onPress={this.toggleFinishOverlay}
                            />

                            <Button
                                containerStyle={{ width: 92 }}
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
                                containerStyle={{ alignSelf: 'flex-end' }}
                                title='Make the Bid'
                                onPress={this.onMakeBidPress}
                            />
                        </>;
                }

            case ChallengeStatus.Voting:
                if (this.state.isOpponent || this.props.isCreator) {
                    return (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button
                                containerStyle={{ width: '40%' }}
                                buttonStyle={{ backgroundColor: '#00c851', height: 62 }}
                                titleStyle={{ color: 'white', fontWeight: '600' }}
                                title='Goal Achieved'
                                onPress={() => this.onVotePress(true)}
                            />
                            <Button
                                containerStyle={{ width: '40%' }}
                                buttonStyle={{ backgroundColor: '#e52b50', height: 62 }}
                                title='Goal not Reached'
                                titleStyle={{ color: 'white', fontWeight: '600' }}
                                onPress={() => this.onVotePress(false)}
                            />
                        </View>
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
