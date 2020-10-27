import React from 'react';
import { View } from 'react-native';

function ChatScreen({ route }) {
    return (
        <View>
            {console.log(route.params.title)}
        </View>
    );
}

export default ChatScreen;