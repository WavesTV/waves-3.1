import { ActionIcon, AppShell, Container, Group, Modal, Tooltip, Space } from '@mantine/core';
import { RiArrowRightDoubleLine, RiArrowLeftDoubleLine } from 'react-icons/ri';
import { useDisclosure } from '@mantine/hooks';
import { MantineHeader } from '@/components/MantineAppShell/MantineHeader/MantineHeader';
import { MantineNavBar } from '@/components/MantineAppShell/MantineNavBar/MantineNavBar';
import { MantineAside } from '@/components/MantineAppShell/MantineAside/MantineAside';
import { MantineFooter } from '@/components/MantineAppShell/MantineFooter/MantineFooter';
import { PiShootingStarLight } from "react-icons/pi";
import { Spotlight } from '../Spotlight/Spotlight';

export function MantineAppShell({ children }) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const [opened, { open, close }] = useDisclosure(false);

    return (
 <>
  <Modal opened={opened} onClose={close} centered>
    <Spotlight/>
  </Modal>
        <AppShell
        padding="md"
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'md',
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        aside={{
          width: 300,
          breakpoint: 'md',
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
      >
        <AppShell.Header>
            <MantineHeader/>
        </AppShell.Header>

        <AppShell.Navbar>
        {desktopOpened ? (
        <>
        
         <Tooltip position="right-start" label="Close Sidebars">
            <ActionIcon mt={11} ml={11}onClick={toggleDesktop} visibleFrom="sm"  >
            <RiArrowLeftDoubleLine/>
            </ActionIcon>
            </Tooltip>
            </>
            ) : 
            null}
            <MantineNavBar/>
        </AppShell.Navbar>

        <AppShell.Aside>
            <MantineAside/>
        </AppShell.Aside>

        <AppShell.Footer >
          <MantineFooter />
        </AppShell.Footer>
   
        <AppShell.Main >
          <Group hiddenFrom="md">
        <Tooltip label="Spotlight">
        <ActionIcon
          variant="gradient"
          gradient={{ from: "blue", to: "cyan", deg: 90 }}
          size="xl"
          radius="xl"
          hiddenFrom="md"
          onClick={open}
        >
          <PiShootingStarLight size="1.4rem" />
        </ActionIcon>
      </Tooltip>

      
      </Group>
      <Space h="xl"/>
        {!desktopOpened ? (
          <Tooltip position="right-start" label="Open Sidebars">
            <div style={{ position: 'fixed' }}>
                <ActionIcon onClick={toggleDesktop} visibleFrom="sm">
                <RiArrowRightDoubleLine />
                </ActionIcon>
            </div>
            </Tooltip>
            ) : null}

            <Container
                style={{
            flexDirection: 'column',
            width: '100%',
            margin: '0 auto',
            overflowX: 'hidden',
                }}
          size="responsive"
    >    
       {children}
        </Container>
        </AppShell.Main>
     </AppShell>
     </>
    );
  }