import React from 'react';
import { Platform, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { Button, Overlay } from 'react-native-elements';

interface DatePickerModalProps {
    date: Date;
    onClose: () => void;
    onChange: (event: Event, date?: Date) => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = (props) => {
    const { date, onClose, onChange } = props;

    const minimumDate = new Date(new Date().setDate(new Date().getDate() + 1));

    if (Platform.OS === 'android') {
        return (
            <DateTimePicker
                style={{ backgroundColor: '#ffffff' }}
                timeZoneOffsetInMinutes={0}
                value={date}
                mode='date'
                minimumDate={minimumDate}
                is24Hour={true}
                display='default'
                onChange={(event, selectedDate) => {
                    onClose();
                    onChange(event, selectedDate);
                }}
            />
        )
    }

    return (
        <Overlay
            overlayStyle={{ padding: 0 }}
            overlayBackgroundColor='rgba(0, 0, 0, 0.2)'
            isVisible={true}
            fullScreen={true}
            animationType='slide'
        >
            <TouchableOpacity style={{flex: 1}} onPress={onClose}>
                <TouchableWithoutFeedback>
                    <View style={{marginTop: 'auto'}}>
                        {Platform.OS === 'ios' && (
                            <View style={{ backgroundColor: '#ffffff', paddingHorizontal: 32 }}>
                                <Button
                                    containerStyle={{ alignSelf: 'flex-end' }}
                                    type='clear'
                                    title='Done'
                                    onPress={onClose}
                                />
                            </View>
                        )}

                        <DateTimePicker
                            style={{ backgroundColor: '#ffffff' }}
                            timeZoneOffsetInMinutes={0}
                            value={date}
                            mode='date'
                            minimumDate={minimumDate}
                            is24Hour={true}
                            display='default'
                            onChange={onChange}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Overlay>
    );
};
