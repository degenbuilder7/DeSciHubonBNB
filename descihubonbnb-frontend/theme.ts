// theme.js or theme.ts if you're using TypeScript
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark', // Set default color mode to dark
    useSystemColorMode: false, // Optional: true if you want to use the system color mode
  },
});

export default theme;
