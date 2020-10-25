import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

function MapScreen(props) {
    return (
        <View styles={styles.container} >
            <Text>Hello</Text>
        </View>
    );
}

// This is for styles. Inside a component, there is almost always a style prop.
// You do style={styles.container} for example.
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    mapStyle: {
        width: "100%",
        height: 450,
    },
    textStyle: {
        margin: 5,
    },
});

export default MapScreen;