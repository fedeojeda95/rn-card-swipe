import React from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar } from 'react-native';
import { CatGallery } from './CatGallery';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={appStyles.container}>
          <CatGallery />
        </View>
      </SafeAreaView>
    </>
  );
};

const appStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { App };
