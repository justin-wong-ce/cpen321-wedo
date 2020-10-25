import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import ListBox from '../components/ListBox';

const lists = [
    {
        id: 1,
        title: 'Groceries',
        completed: false
    },
    {
        id: 2,
        title: 'Rockets',
        completed: false
    },
    {
        id: 3,
        title: 'Presentation',
        completed: false
    },
    {
        id: 4,
        title: 'Competition',
        completed: false
    },
    {
        id: 5,
        title: 'Robotic Project',
        completed: false
    },
]

function MainScreen(props) {
    const [quickLists, setQuickLists] = useState([lists[0], lists[1]]);
    const [recentLists, setRecentLists] = useState([lists[1], lists[2], lists[3], lists[4]]);

    return (
        <View style={styles.container}>
            <View style={styles.quickAccessContainer}>
                <MaterialIcons name="star" size={40} color="#6FCECE" style={styles.starIcon} />
                <Text style={styles.text} >Quick Access</Text>
                <MaterialCommunityIcons name="square-edit-outline" size={40} color="#6FCECE" style={styles.editIcon} />
            </View>

            <View style={styles.quickAccessListsContainer}>
                <ListBox title={quickLists[0].title} />
                <ListBox title={quickLists[1].title} />
            </View>

            <View style= {styles.recentContainer} >
                <FontAwesome5 name="clock" size={35} color="#6FCECE" style={styles.clockIcon} />
                <Text style={styles.text} >Recent Lists</Text>
            </View>

            <View style={styles.recentListsContainer} >
                <View style={styles.recentListRow} >
                    <ListBox title={recentLists[0].title} />
                    <ListBox title={recentLists[1].title} />
                </View>
                <View style={styles.recentListRow} >
                    <ListBox title={recentLists[2].title} />
                    <ListBox title={recentLists[3].title} />
                </View>
            </View>

            <View style={styles.footerContainer} >
                <Feather name="plus-circle" size={40} color="#6FCECE" style={styles.plusIcon} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    quickAccessContainer: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 10,
    },
    quickAccessListsContainer: {
        width: '100%',
        height: 150,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        paddingTop: 10,
    },
    recentContainer: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 10,
    },
    recentListsContainer: {
        width: '100%',
        height: 340,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 20,
    },
    recentListRow: {
        width: '100%',
        height: '50%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 30,
        color: '#6FCECE',
        letterSpacing: 1,
    },
    footerContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        position: 'absolute',
        left: 10,
        paddingTop: 10,
    },
    editIcon: {
        position: 'absolute',
        right: 10,
        paddingTop: 10,
    },
    clockIcon: {
        position: 'absolute',
        left: 10,
        paddingTop: 15,
    },
    plusIcon: {
        position: 'absolute',
        right: 10,      
    }
});

export default MainScreen;