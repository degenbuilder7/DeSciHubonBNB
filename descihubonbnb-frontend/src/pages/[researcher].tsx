import { Box, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';
import ResearcherPapers from '../components/ResearcherPapers';
import Uploadtab from '../components/Uploadtab';
import Allpaper from '../components/papers/allpapers';
import Funding from '../components/funding';
import EncryptedPapers from '../components/papers/encryptedpapers';
import SecretFunding from '../components/secretfunding'; 

type ResearcherPageProps = {
  address: string;
};

const ResearcherPage: React.FC<ResearcherPageProps> = ({address}) => {
  return (
    <Box p={8}>
      <Heading as="h1" mb={4}>
        Researcher Page { address}
      </Heading>
      <Tabs variant="soft-rounded" colorScheme="teal">
        <TabList>
          <Tab>My Encrypted Papers</Tab>
          <Tab>Get Papers</Tab>
          <Tab>New Paper</Tab>
          <Tab>Waiting for Approval</Tab>
          <Tab>Approved Papers</Tab>
          <Tab>Rejected Papers</Tab>
          <Tab>Published Papers</Tab>
          <Tab>ZK Funding using Polyhedra</Tab>
          <Tab>CrossChain Funding using Axellar</Tab>
        </TabList>
        <TabPanels>
        <TabPanel>
            <EncryptedPapers />
          </TabPanel>
          <TabPanel>
            <Allpaper />
          </TabPanel>
          <TabPanel>
            <Uploadtab />
          </TabPanel>
          <TabPanel>
            <ResearcherPapers address={address} status="waiting" />
          </TabPanel>
          <TabPanel>
            <ResearcherPapers address={address} status="approved" />
          </TabPanel>
          <TabPanel>
            <ResearcherPapers address={address} status="rejected" />
          </TabPanel>
          <TabPanel>
            <ResearcherPapers address={address} status="published" />
          </TabPanel>
          <TabPanel>
            <Funding />
          </TabPanel>
          <TabPanel>
            <SecretFunding />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ResearcherPage;
