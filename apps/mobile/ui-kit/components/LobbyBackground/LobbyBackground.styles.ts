import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    overflow: 'hidden'
  },

  layer: {
    pointerEvents: 'none',
    position: 'absolute',
    inset: 0,
    overflow: 'hidden'
  },

  mark: {
    position: 'absolute'
  }
});
