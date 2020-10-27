import React, { useContext } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../routes/AuthProvider';

function LoginScreen(props) {
    const { login, logout } = useContext(AuthContext);
    return (
        <View style={styles.container} >
            <Button 
                title="Google Sign-In"
                onPress={() => login()}
            />

            <Button 
                title="Log-out"
                onPress={() => logout()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
  });
export default LoginScreen;