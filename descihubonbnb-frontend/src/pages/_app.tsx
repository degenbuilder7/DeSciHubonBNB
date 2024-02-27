import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Box, Flex } from '@chakra-ui/react';
import { ResearcherProvider } from '../../context/ResearcherContext';
import type { AppProps } from 'next/app';
import { PolybaseProvider , AuthProvider} from "@polybase/react";
import { Polybase } from "@polybase/client";
import { Auth } from "@polybase/auth";
import { ThirdwebProvider } from '@thirdweb-dev/react';

function MyApp({ Component, pageProps }: AppProps) {
  // polybase
  const polybase = new Polybase();
  const auth: Auth | null = typeof window !== "undefined" ? new Auth() : null;

  return (
    <ChakraProvider>
    <ThirdwebProvider
      activeChain="avalanche-fuji"
      clientId="YOUR_CLIENT_ID" // You can get a client id from dashboard settings
    >
        <PolybaseProvider polybase={polybase}>
        <AuthProvider
          // @ts-ignore
          auth={auth}
          polybase={polybase}>
            <Flex flexDirection="column" minHeight="100vh">
              <Navbar />
              <Box flex="1">
                <ResearcherProvider>
                    <Component {...pageProps} />
                </ResearcherProvider>
              </Box>
              <Footer />
            </Flex>
        </AuthProvider>
        </PolybaseProvider>
      </ThirdwebProvider>
    </ChakraProvider>
  )
}

export default MyApp;
