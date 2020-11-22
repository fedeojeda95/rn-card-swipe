import React from 'react';
import { StyleSheet, Image, Text, Animated } from 'react-native';
import { CardGestureHandler } from './CardGestureHandler';

import { Cat } from './Cats';
import { useAnimatedValue, useAnimatedXY } from './hooks';

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
  const position = useAnimatedXY({ x: 0, y: 0 });
  const scaling = useAnimatedValue(isTop ? 1 : 0.9);

  const rotate = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp',
  });

  const transformations = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
      { scale: scaling },
    ],
  };

  const contentView = (
    <Animated.View style={[transformations, catCardStyles.container]}>
      <Image style={catCardStyles.image} source={cat.image} />
      <Text style={catCardStyles.name}>{cat.name}</Text>
      <Text style={catCardStyles.description}>{cat.description}</Text>
    </Animated.View>
  );

  return (
    <CardGestureHandler
      onRemove={onDismiss ? onDismiss : () => {}}
      fullSize={isTop}
      position={position}
      scaling={scaling}>
      {contentView}
    </CardGestureHandler>
  );
};

export { CatCard };
