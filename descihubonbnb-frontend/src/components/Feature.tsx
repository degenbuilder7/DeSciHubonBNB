import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { ReactElement } from 'react';
import {
  FcAbout,
  FcCollaboration,
  FcDonate,
  FcManager,
} from 'react-icons/fc';
import { GrPersonalComputer, GrStorage } from 'react-icons/gr';
import { SiLighthouse , SiProbot} from 'react-icons/si';
interface CardProps {
  heading: string;
  description: string;
  icon: ReactElement;
}

const Card = ({ heading, description, icon }: CardProps) => {
  return (
    <Box
      maxW={{ base: 'full', md: '275px' }}
      w={'full'}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={5}
    >
      <Stack align={'start'} spacing={2}>
        <Flex
          w={16}
          h={16}
          align={'center'}
          justify={'center'}
          color={'white'}
          rounded={'full'}
          bg={useColorModeValue('gray.100', 'gray.700')}
          mx={'auto'}
        >
          {icon}
        </Flex>
        <Box mt={2}>
          <Heading size="md">{heading}</Heading>
          <Text mt={1} fontSize={'sm'}>
            {description}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};


export default function Feature() {
  return (
    <Box p={4}>
      <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
        <Heading fontSize={{ base: '2xl', sm: '4xl' }} fontWeight={'bold'}>
          Features
        </Heading>
        <Text color={'gray.600'} fontSize={{ base: 'sm', sm: 'lg' }}>
          Descihub is powered by the best features to provide a decentralised platform for researchers to publish their research papers and get paid for it.
        </Text>
      </Stack>

      <Container maxW={'5xl'} mt={12}>
        <Flex flexWrap="wrap" gridGap={6} justify="center">
          <Card
            heading={'NFT Chat Powered'}
            icon={<Icon as={FcManager} w={10} h={10} />}
            description={
              'Chat with your community members and get access to exclusive content and groups powered by Polybase.'
            }
          />
          <Card
            heading={'ZK Funding of the research Papers'}
            icon={<Icon as={GrStorage} w={10} h={10} />}
            description={
              'Make cross-chain zk contributions to research papers, empowered by zero-knowledge proofs through Polyhedra. Unlock funding and collaboration across networks.'
            }
          />

          <Card
            heading={'Global Collaboration'}
            icon={<Icon as={FcCollaboration} w={10} h={10} />}
            description={
              'Collaborate with peers from all over the globe using Polybase and enhance your research projects.'
            }
          />
          <Card
            heading={'Lighthouse Powered Access Control'}
            icon={<Icon as={SiLighthouse} w={10} h={10} />}
            description={
              'Apply access control to your files uploaded to BSC, ensuring privacy and data protection.'
            }
          />
          <Card
            heading={'Peer Review System'}
            icon={<Icon as={SiProbot} w={10} h={10} />}
            description={
              'Contribute to the research community and earn tokens and reputation by peer-reviewing work using the Polybase platform.'
            }
          />
          <Card
            heading={'Decentralized Storage'}
            icon={<Icon as={GrPersonalComputer} w={10} h={10} />}
            description={
              'Store your research papers on the Filecoin Virtual Machine (BSC) for durable, secure, and resilient storage.'
            }
          />
        </Flex>
      </Container>
    </Box>
  );
}