import React, { useCallback, useState } from 'react';
import { CatCard } from './CatCard';
import { Cat, allCats } from './Cats';

const CatGallery = () => {
  const [cats, setCats] = useState<Cat[]>(allCats);

  const onCatDismissed = useCallback(() => {
    setCats((currentCats) => {
      return currentCats.slice(0, -1);
    });
  }, []);

  return (
    <>
      {cats.map((cat, index) => {
        const isTopCat = index === cats.length - 1;

        return (
          <CatCard
            cat={cat}
            key={cat.name}
            isTop={isTopCat}
            onDismiss={onCatDismissed}
          />
        );
      })}
    </>
  );
};

export { CatGallery };
