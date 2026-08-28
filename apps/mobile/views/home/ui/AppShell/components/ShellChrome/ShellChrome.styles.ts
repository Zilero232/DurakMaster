import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1
  },

  /** On desktop the navigation moves to the left, so the shell becomes a row. */
  desktopRoot: {
    flex: 1,
    flexDirection: 'row'
  },

  content: {
    flex: 1,
    minWidth: 0
  }
});
