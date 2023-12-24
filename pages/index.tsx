
import { SignAndSubmitTx } from '../components/SignAndSubmit/SubmitPost';
import { Paper, Space, Container } from '@mantine/core';
import { useState } from 'react';
import { HomeTabs } from '@/components/HomeTabs/HomeTabs';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string | null>('first');
  
  return (
    <>
   <Container size="30rem" px={0}>
              <Paper m="md" shadow="lg" radius="sm" p="xl" withBorder>
    <SignAndSubmitTx />
    </Paper>
    </Container>
    <Space h="md" />
   
  
    <HomeTabs/>
     


    
      

      <Space h="md" />

     
    </>
  );
}
