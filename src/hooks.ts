import { useRef } from 'react';
import { Animated } from 'react-native';

export const useAnimatedXY = (
  initialValue:
    | {
        x: number | Animated.Value;
        y: number | Animated.Value;
      }
    | undefined,
) => {
  return useRef(new Animated.ValueXY(initialValue)).current;
};

export const useAnimatedValue = (initialValue: number) => {
  return useRef(new Animated.Value(initialValue)).current;
};
