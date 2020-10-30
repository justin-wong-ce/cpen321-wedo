import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

function MainHeader(props) {
    return (
        <View style={styles.header}>
            <MaterialIcons name="dehaze" size={40} color="white" style={styles.menuIcon}/>
            <Text style={styles.headerText }>Home</Text>
            <MaterialCommunityIcons name="map-marker-circle" size={40} color="white" style={styles.mapIcon} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        backgroundColor: '#5A596C',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#fff',
        letterSpacing: 1,
    },
    menuIcon: {
        position: 'absolute',
        left: 10,
    },
    mapIcon: {
        position: 'absolute',
        right: 10,
    },
});
export default MainHeader;