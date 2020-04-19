import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { } from 'react-native-elements';

const ResolveAuthScreen = ({ navigation }) => {

    // TODO: Add real auth

    setTimeout(() => navigation.navigate('loginFlow'), 3000);

    return (
        <View style={styles.container}>
            <ActivityIndicator
                size="large" style={{ marginTop: 300 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default ResolveAuthScreen;