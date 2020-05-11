import React, { useState } from 'react';
import { ScrollView, Button, Platform, View, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ChallengeNavigationProp } from './ChallengeStackNavigator';
import { ChallengeCard } from '../../../components';
import { TextInput } from 'react-native-gesture-handler';
import { createChallenge } from '../../../api/api';
import { AppContext } from '../../../contexts/AppContext';
import { User } from 'firebase';

interface ChallengeProps {
    navigation: ChallengeNavigationProp;
}

export const Challenge: React.FC<ChallengeProps> = ({ navigation }) => {
    const { state } = React.useContext(AppContext);
    const { user } = state;

    const [rate, setRate] = useState('');
    const [description, setDescription] = useState('');

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const onChange = (event: any, selectedDate?: Date | undefined) => {
        console.log(selectedDate);
        const currentDate = selectedDate?.getTime() || date;
        setShow(Platform.OS === 'ios');
        console.log(currentDate);

        setDate(new Date(currentDate));
    };

    const showDatepicker = () => {
        setShow(true);
    };

    return (
        <ScrollView>
            <TextInput
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => setRate(text)}
                value={rate}
            />
            <TextInput
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => setDescription(text)}
                value={description}
            />
            <Button onPress={showDatepicker} title='Show date picker!' />
            {show && (
                <DateTimePicker
                    testID='dateTimePicker'
                    timeZoneOffsetInMinutes={0}
                    value={date}
                    mode='date'
                    is24Hour={true}
                    display='default'
                    onChange={onChange}
                />
            )}
            <Text>{rate}</Text>
            <Text>{description}</Text>
            <Text>{date.getTime()}</Text>
            <Button
                onPress={() =>
                    createChallenge(rate, date.getTime(), description, user?.id as string)
                }
                title='Поставить цель'
            />
        </ScrollView>
    );
};
