import React, { useEffect } from 'react';
import { Animated } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';

const VELOCITY_TRESHOLD = 1500;
const X_TRESHOLD = 100;

interface CardHestureHandlerProps {
  children: React.ReactNode;
  onRemove: () => void;
  fullSize: boolean;
  scaling: Animated.Value;
  position: Animated.ValueXY;
}

export const CardGestureHandler = ({
  children,
  onRemove,
  fullSize,
  scaling,
  position,
}: CardHestureHandlerProps) => {
  useEffect(() => {
    function scaleCardToFullSize() {
      Animated.spring(scaling, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 10,
        speed: 12,
      }).start();
    }

    if (fullSize) {
      scaleCardToFullSize();
    }
  }, [scaling, fullSize]);

  const handlePanEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: position.x,
          translationY: position.y,
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
    Animated.decay(position, {
      velocity: { x: velocityX, y: velocityY },
      deceleration: 0.9,
      useNativeDriver: true,
    }).start(() => {
      onRemove();
    });
  };

  const putCardBackIntoPlace = () => {
    Animated.spring(position, {
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

  return (
    <PanGestureHandler
      minDist={0}
      onGestureEvent={handlePanEvent}
      onHandlerStateChange={handlePanEventChange}>
      {children}
    </PanGestureHandler>
  );
};
