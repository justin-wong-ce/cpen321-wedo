import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';

function TaskInfoScreen({ navigation, route }) {
    
    return (
        <View style={styles.container} >
            <View style={styles.nonTaskContainer} >
    <Text>Last Modified: {route.params.lastTimeModified.toString()}</Text>
            </View>
            <ScrollView>
                {console.log(route.params.timeCreated.toString())}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    nonTaskContainer: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#C2C5C3',
        borderBottomWidth: 1,
    },
    taskContainer: {
        flex: 1,
        
    },
});

export default TaskInfoScreen;