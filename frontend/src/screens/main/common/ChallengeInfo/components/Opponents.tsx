import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Button, Text, ListItem } from 'react-native-elements';
import { UsersNavigationProp } from '../../../users/UsersStackNavigator';

export const Opponents = (c: any) => {
    const [showOpponents, setShowOpponents] = React.useState<boolean>(false);

    const opponents = c.opponents;
    return (
        opponents.length > 0 && (
            <>
                <Button
                    title='opponents'
                    onPress={() => {
                        setShowOpponents(!showOpponents);
                    }}
                    style={[{borderRadius: 15,}]}
                />
                {showOpponents && (
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={opponents}
                        renderItem={({ item }) => (
                            <ListItem
                                title={item.username}
                                rightTitle={item.message}
                                leftAvatar={{ source: { uri: item.avatar } }}
                                bottomDivider
                            />
                        )}
                    />
                )}
            </>
        )
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
