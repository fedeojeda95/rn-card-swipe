import { cat1, cat2, cat3, cat4 } from './images';
import { ImageURISource } from 'react-native';

export interface Cat {
  name: string;
  description: string;
  image: ImageURISource;
}

export const allCats: Cat[] = [
  {
    name: 'A cat',
    description: 'this is a nice cat',
    image: cat1,
  },
  {
    name: 'Oh a cat',
    description: 'This is a nice cat',
    image: cat2,
  },
  {
    name: 'Another cat',
    description: 'This is another cat',
    image: cat3,
  },
  {
    name: 'Cat',
    description: 'A description of the cat',
    image: cat4,
  },
];
