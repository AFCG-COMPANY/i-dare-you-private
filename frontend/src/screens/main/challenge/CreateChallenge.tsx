import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppContext } from '../../../contexts/AppContext';
import { Action } from '../../../models/action';
import { createAction } from '../../../helpers/create-action';
import { getFormattedDateString } from '../../../helpers/date.helper';
import { createChallenge } from '../../../api/challenge';
import { ChallengeNavigationProp } from './СreateChallengeStackNavigator';
import { DatePickerModal, DismissKeyboardView } from '../../../components';

enum Actions {
    BidChange,
    DescriptionChange,
    EndDateChange,
    ToggleDatePicker,
    CreateChallengeStart,
    CreateChallengeError,
    CreateChallengeSuccess
}

interface CreateChallengeState {
    bid: string;
    description: string;
    endDate: Date | null;
    datePickerVisible: boolean;
    error: string | null;
    loading: boolean;
}

const initialState: CreateChallengeState = {
    bid: '',
    description: '',
    endDate: null,
    datePickerVisible: false,
    error: null,
    loading: false
};

function createChallengeReducer(state: CreateChallengeState, action: Action<Actions>) {
    switch (action.type) {
        case Actions.BidChange:
            return {...state, bid: action.payload};
        case Actions.DescriptionChange:
            return {...state, description: action.payload};
        case Actions.EndDateChange:
            return {...state, endDate: action.payload};
        case Actions.ToggleDatePicker:
            return {...state, datePickerVisible: action.payload};
        case Actions.CreateChallengeStart:
            return {...state, loading: true};
        case Actions.CreateChallengeSuccess:
            return {...state, loading: false};
        case Actions.CreateChallengeError:
            console.log(action.payload);
            return {...state, error: action.payload, loading: false};
        default:
            return {...state};
    }
}

interface CreateChallengeProps {
    navigation: ChallengeNavigationProp;
}

export const CreateChallenge: React.FC<CreateChallengeProps> = ({ navigation }) => {
    const { state } = React.useContext(AppContext);
    const { user } = state;

    const [ localState, localDispatch ] = React.useReducer(createChallengeReducer, initialState);

    return (
        <DismissKeyboardView style={styles.container}>
            <KeyboardAwareScrollView bounces={false} keyboardShouldPersistTaps='handled'>
                <Input
                    containerStyle={styles.inputContainer}
                    labelStyle={styles.inputLabel}
                    label='Bid'
                    placeholder='$100, ice hole dipping, etc.'
                    multiline={true}
                    value={localState.bid}
                    onChangeText={bid => localDispatch(createAction(Actions.BidChange, bid))}
                />

                <View style={styles.datePickerField}>
                    <Text style={styles.datePickerFieldLabel}>END DATE</Text>
                    <TouchableWithoutFeedback
                        onPress={() => localDispatch(createAction(Actions.ToggleDatePicker, true))}
                    >
                        {localState.endDate
                            ?
                            <Text style={styles.datePickerFieldValue}>{getFormattedDateString(localState.endDate)}</Text>
                            :
                            <Text style={styles.datePickerFieldPlaceholder}>Due date of the challenge.</Text>
                        }
                    </TouchableWithoutFeedback>
                </View>

                {localState.datePickerVisible && (
                    <DatePickerModal
                        date={localState.endDate || new Date()}
                        onChange={(event, date) => localDispatch(createAction(Actions.EndDateChange, date))}
                        onClose={() => localDispatch(createAction(Actions.ToggleDatePicker, false))}
                    />
                )}

                <Input
                    containerStyle={styles.inputContainer}
                    labelStyle={styles.inputLabel}
                    label='Description'
                    placeholder='Describe the goal of the challenge.'
                    multiline={true}
                    maxLength={140}
                    clearButtonMode='while-editing'
                    onChangeText={description => localDispatch(createAction(Actions.DescriptionChange, description))}
                    value={localState.description}
                />
            </KeyboardAwareScrollView>

            <Button
                containerStyle={styles.button}
                loading={localState.loading}
                title='Start the Challenge'
                onPress={() => {
                    // Validate form
                    if (!localState.bid || !localState.endDate || !localState.description) {
                        localDispatch(createAction(
                            Actions.CreateChallengeError,
                            'Please fill in the form. All fields are required.'
                        ));

                        return;
                    }

                    // Show loading indicator
                    localDispatch(createAction(Actions.CreateChallengeStart, null));

                    createChallenge(
                        localState.bid,
                        (localState.endDate as Date).getTime(),
                        localState.description,
                        user?.id as string
                    ).then(() => {
                        localDispatch(createAction(Actions.CreateChallengeSuccess, null));
                        navigation.navigate('Feed');
                    }).catch(e => {
                        localDispatch(createAction(Actions.CreateChallengeError, e));
                    })
                }}
            />
            {localState.error && <Text style={styles.error}>{localState.error}</Text>}
        </DismissKeyboardView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 40,
        flex: 1,
        backgroundColor: '#fff'
    },
    inputContainer: {
        marginBottom: 20,
        paddingHorizontal: 0
    },
    inputLabel: {
        textTransform: 'uppercase'
    },
    datePickerField: {
        marginBottom: 20,
        borderBottomColor: '#B4BBC1',
        borderBottomWidth: 1
    },
    datePickerFieldLabel: {
        fontSize: 16,
        color: '#86939e',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    datePickerFieldPlaceholder: {
        paddingTop: 5,
        fontSize: 18,
        minHeight: 40,
        color: '#c9c9c9'
    },
    datePickerFieldValue: {
        paddingTop: 5,
        fontSize: 18,
        minHeight: 40
    },
    button: {
        marginTop: 40
    },
    error: {
        alignSelf: 'center',
        color: 'tomato'
    }
});
