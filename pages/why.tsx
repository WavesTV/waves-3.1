import { Welcome } from "@/components/Welcome/Welcome";
import { Text, Space, Grid, Paper, Container, Center } from "@mantine/core";
import { ImArrowDown2 } from "react-icons/im";
import { Fade } from 'react-awesome-reveal';
import { HowItWorks } from "@/components/HowItWorks/HowItWorks";
export default function Why() {

return(
    <>
    <Space h={111}/>
<div>
    <Welcome />
    </div>

    
    <HowItWorks/>

    <Space h="xl"/>
 <Text ta="center" fz={50} fw={800} fs="italic" variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 176 }}>Roadmap</Text>
 
  <Space h="md"/>
    <Container> 
      
<Fade>
      <Paper shadow="xl" radius="lg" withBorder p="xl">
      <Text td="underline" ta="center" fw={500}>Stream Dashboard Rendering</Text>
        <Text c="dimmed" fw={200}>Making sure stream dashboard renders if a user is streaming and clicks away from their dashboard.</Text>
        <Space h="md"/>
        <Text c="dimmed" fw={200}>Will save Stream ID, Title, and Playback ID to user profile to render components.</Text>
        <Space h="md"/>
        <Text c="dimmed" fw={200}>User will still lose their Stream Key if they click away.</Text>
        <Space h="md"/>
    </Paper>
</Fade>
<Space h="sm"/>
        <Center>
       <ImArrowDown2/>
       </Center>
       <Space h="sm"/>
<Fade>
      <Paper shadow="xl" radius="lg" withBorder p="xl">
      <Text td="underline" ta="center" fw={500}>Channel Chats</Text>
        <Text c="dimmed" fw={200}>1st iteration will use Firebase for Channel Chats so logged in users can engage with streamers.</Text>
        <Space h="md"/>
        <Text c="dimmed" fw={200}>Future iterations will use DeSo Chat Protocol (DCP) to stay full onchain.</Text>
        <Space h="md"/>
    </Paper>
</Fade>
    <Space h="sm"/>
        <Center>
       <ImArrowDown2/>
       </Center>
       <Space h="sm"/>
    <Fade>
      <Paper shadow="xl" radius="lg" withBorder p="xl">
      <Text td="underline" ta="center" fw={500}>Subcription Rewards</Text>
        <Text c="dimmed" fw={200}>Automating rewards when user subcribes.</Text>
        <Space h="md"/>
        <Text c="dimmed" fw={200}>Subscriber/Profile Badges, Confirmation NFT, and more.</Text>
       <Space h="md"/>
    </Paper>
</Fade>
    <Space h="sm"/>
        <Center>
       <ImArrowDown2/>
       </Center>
       <Space h="sm"/>
<Fade>
      <Paper shadow="xl" radius="lg" withBorder p="xl">
          <Text td="underline" ta="center" fw={500}>Clean Up</Text>
        <Text c="dimmed" fw={200}>Fixing any bugs and adding small features based on feedback and testing.</Text>
        <Space h="md"/>
        
    </Paper>
      </Fade>
      <Space h="sm"/>
        <Center>
       <ImArrowDown2/>
       </Center>
       <Space h="sm"/>
<Fade>
       <Paper shadow="xl" radius="lg" withBorder p="xl">
          <Text td="underline" ta="center" fw={500}>Community Takeover</Text>
        <Text c="dimmed" fw={200}>Once the foundation for Waves is complete the platform direction will be dependent on the community.</Text>
        <Space h="md"/>
        <Text c="dimmed" fw={200}>Could be done through on-chain voting or some open forum basis.</Text>
           <Space h="md"/>
    </Paper>
      </Fade>

   </Container>
   <Space h="lg"/>

</>
)
}