import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

function ListBox({ title }) {
    return (
        <TouchableOpacity style={styles.container}>
            <Text style={styles.text} >{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
      width: '40%',
      height: '90%',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius: 20,
    },
    text: {
        fontSize: 20,
        color: '#5A596C',
    },
  });
export default ListBox;