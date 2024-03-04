import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Box, Flex, HStack, Link, Stack, useColorMode, useColorModeValue, useDisclosure, Avatar, Menu, MenuButton, MenuList, MenuDivider, MenuItem, Center } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import StaticImage from 'next/image';
import desci from "../../asset/desci.png";
import { Button } from '@chakra-ui/button';
import { ConnectWallet, useAddress } from '@thirdweb-dev/react';

const NavLink = ({ children, href }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={href}>
    {children}
  </Link>
);

export default function Navbar() {
  const address = useAddress();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const Links = [
    { label: 'Researchhub', href: '/researchhub'},
    { label: 'AIAccessNFT', href: '/nft' },
    { label: 'Peer Review', href: '/nftchat' },
    { label: 'Dashboard', href: `/dashboard/${address}` },
  ];

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={8} alignItems={'center'}>
            <Link href="/">
              <StaticImage src={desci} alt="Logo" width={200} height={40} className='mx-2 mt-4'/>
            </Link>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link.label} href={link.href}>
                  {link.label}
                </NavLink>
              ))}
            </HStack>
          </HStack>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <ConnectWallet />
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
