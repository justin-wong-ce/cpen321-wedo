import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen';
import MainHeader from '../components/MainHeader';

const stack = createStackNavigator();

function Stack() {
  return (
    <stack.Navigator>
      <stack.Screen 
        name="MainScreen" 
        component={MainScreen} 
        options={{ 
            headerStyle: styles.header,
            headerTitle: props => <MainHeader {...props} /> }} />
    </stack.Navigator>
  );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#5A596C',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#fff',
        letterSpacing: 1,
    },
    menuIcon: {
        position: 'absolute',
        left: 16,
    }
});
export default Stack;