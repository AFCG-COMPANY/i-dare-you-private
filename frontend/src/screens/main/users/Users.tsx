import React from 'react';
import { ActivityIndicator, View, FlatList } from 'react-native';
import { Input, ListItem } from 'react-native-elements';
import { User } from '../../../models';
import useDebounce from '../../../hooks/useDebounce';
import { getUsers } from '../../../api/api';

interface UsersProps {
}

export const Users: React.FC<UsersProps> = ({}) => {
    // State and setter for search term
    const [searchTerm, setSearchTerm] = React.useState('');
    // State and setter for search results
    const [results, setResults] = React.useState<User[]>([]);
    // State for search status (whether there is a pending API request)
    const [isSearching, setIsSearching] = React.useState(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    React.useEffect(() => {
        setIsSearching(true);

        getUsers(debouncedSearchTerm)
            .then(users => setResults(users))
            .catch(e => {
                console.log(e);
                setResults([]);
            })
            .finally(() => setIsSearching(false));
    }, [debouncedSearchTerm]);

    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <Input
                placeholder='Search for users'
                value={searchTerm}
                clearButtonMode='always'
                onChangeText={value => setSearchTerm(value)}
            />

            {
                isSearching
                ?
                <ActivityIndicator
                    style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}
                    size='large'
                />
                :
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={results}
                    renderItem={renderUserListItem}
                />
            }
        </View>
    );
};

const renderUserListItem = ({ item }: { item: User }) => (
    <ListItem
        title={item.username}
        subtitle={item.bio}
        leftAvatar={{ source: { uri: item.avatar } }}
        bottomDivider
        chevron
    />
);
