import React from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, View } from 'react-native';
import { Input, ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../../models';
import useDebounce from '../../../hooks/useDebounce';
import { getUsers } from '../../../api/api';
import { UsersNavigationProp } from './UsersStackNavigator';
import { AppContext } from '../../../contexts/AppContext';

interface UsersProps {
    navigation: UsersNavigationProp;
}

export const Users: React.FC<UsersProps> = ({ navigation }) => {
    const { state } = React.useContext(AppContext);

    // State and setter for search term
    const [searchTerm, setSearchTerm] = React.useState('');
    // State and setter for search results
    const [results, setResults] = React.useState<User[]>([]);
    // State for search status (whether there is a pending API request)
    const [isSearching, setIsSearching] = React.useState(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    React.useEffect(() => {
        setIsSearching(true);

        const userId = state.user?.id || '';
        getUsers(debouncedSearchTerm, userId)
            .then(users => setResults(users))
            .catch(e => {
                console.log(e);
                setResults([]);
            })
            .finally(() => setIsSearching(false));
    }, [debouncedSearchTerm]);

    return (
        <View style={styles.container}>
            <Input
                containerStyle={{paddingHorizontal: 0}}
                inputContainerStyle={{borderColor: '#e0e0e0'}}
                placeholder='Search for users'
                value={searchTerm}
                clearButtonMode='always'
                leftIcon={<Ionicons name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} size={20} color='gray' />}
                leftIconContainerStyle={{marginRight: 8}}
                onChangeText={value => setSearchTerm(value)}
            />

            {
                isSearching
                ?
                <ActivityIndicator
                    style={styles.loader}
                    size='large'
                />
                :
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={results}
                    renderItem={({ item }) => (
                        <ListItem
                            title={item.username}
                            subtitle={item.bio}
                            subtitleProps={{numberOfLines: 1}}
                            leftAvatar={{ source: { uri: item.avatar } }}
                            bottomDivider
                            chevron
                            onPress={() => navigation.navigate('UserInfo', { user: item })}
                        />
                    )}
                />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    }
});
