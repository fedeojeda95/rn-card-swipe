import React, { useEffect } from 'react';
import { StyleSheet, Image, Text, Animated } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';

import { Cat } from './Cats';
import { useAnimatedValue, useAnimatedXY } from './hooks';

const VELOCITY_TRESHOLD = 1500;
const X_TRESHOLD = 100;

const catCardStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderRadius: 16,
    backgroundColor: 'white',
    width: '80%',
    height: '60%',
    borderWidth: 1,
    borderColor: 'gray',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '50%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  name: {
    margin: 8,
    fontSize: 28,
  },
  description: {
    margin: 8,
    fontSize: 20,
  },
});

const CatCard = ({
  cat,
  isTop,
  onDismiss,
}: {
  cat: Cat;
  isTop: boolean;
  onDismiss?: () => void;
}) => {
  const gesturePosition = useAnimatedXY({ x: 0, y: 0 });
  const scaling = useAnimatedValue(isTop ? 1 : 0.9);

  useEffect(() => {
    function scaleCardToFullSize() {
      Animated.spring(scaling, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 16,
        speed: 12,
      }).start();
    }

    if (isTop) {
      scaleCardToFullSize();
    }
  }, [scaling, isTop]);

  const handlePanEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: gesturePosition.x,
          translationY: gesturePosition.y,
        },
      },
    ],
    { useNativeDriver: true },
  );

  const shouldRemoveCard = (velocityX: number, translationX: number) => {
    const hasEnoughVelocity =
      velocityX < -VELOCITY_TRESHOLD || velocityX > VELOCITY_TRESHOLD;
    const hasMovedEnoughInXAxis =
      translationX < -X_TRESHOLD || translationX > X_TRESHOLD;
    return hasEnoughVelocity && hasMovedEnoughInXAxis;
  };

  const removeCard = (velocityX: number, velocityY: number) => {
    Animated.decay(gesturePosition, {
      velocity: { x: velocityX, y: velocityY },
      deceleration: 0.9,
      useNativeDriver: true,
    }).start(() => {
      if (onDismiss) {
        onDismiss();
      }
    });
  };

  const putCardBackIntoPlace = () => {
    Animated.spring(gesturePosition, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      bounciness: 10,
    }).start();
  };

  const handlePanEventChange = (event: PanGestureHandlerStateChangeEvent) => {
    const {
      nativeEvent: { state, velocityX, translationX, velocityY },
    } = event;

    const gestureHasEnded = state === State.END;
    if (gestureHasEnded) {
      if (shouldRemoveCard(velocityX, translationX)) {
        removeCard(velocityX, velocityY);
      } else {
        putCardBackIntoPlace();
      }
    }
  };

  const rotate = gesturePosition.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp',
  });

  const transformations = {
    transform: [
      { translateX: gesturePosition.x },
      { translateY: gesturePosition.y },
      { rotate },
      { scale: scaling },
    ],
  };

  return (
    <PanGestureHandler
      minDist={0}
      onGestureEvent={handlePanEvent}
      onHandlerStateChange={handlePanEventChange}>
      <Animated.View style={[transformations, catCardStyles.container]}>
        <Image style={catCardStyles.image} source={cat.image} />
        <Text style={catCardStyles.name}>{cat.name}</Text>
        <Text style={catCardStyles.description}>{cat.description}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

export { CatCard };
