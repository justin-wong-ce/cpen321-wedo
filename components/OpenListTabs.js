import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TaskInfoScreen from '../screens/TaskInfoScreen';
import ChatScreen from '../screens/ChatScreen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function OpenListTabs(props) {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
  
                if (route.name === 'Members') {
                    iconName = focused ? 'chat' : 'chat-outline';
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                } else if (route.name === 'Tasks') {
                    iconName = focused ? 'ios-list-box' : 'ios-list';
                    return <Ionicons name={iconName} size={size} color={color} />;
                }
            },
          })}
        >
            <Tab.Screen name="Tasks" component={TaskInfoScreen} />
            <Tab.Screen name="Members" component={ChatScreen} />
        </Tab.Navigator>
    );
}

export default OpenListTabs;