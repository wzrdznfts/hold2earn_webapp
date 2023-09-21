import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

// This is the chainId your dApp will work on.

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain={"ethereum"}
      clientId="955f8f5f20c622128fc46d0fbc171fde"
    >
      <>
        <Navbar bg="dark">
          <Container>
            <Navbar.Brand href="#home"></Navbar.Brand>
          </Container>
        </Navbar>
        <Component {...pageProps} />
      </>
    </ThirdwebProvider>
  );
}

export default MyApp;
