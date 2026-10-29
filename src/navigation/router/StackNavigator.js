import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTER_NAME } from '../NavigationConst';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
      initialRouteName={ROUTER_NAME.SPLASH.name}>
      {Object.values(ROUTER_NAME).map(screen => {
        return <Stack.Screen key={screen.name} {...screen} />;
      })}
    </Stack.Navigator>
  );
};

export { AppStack };
