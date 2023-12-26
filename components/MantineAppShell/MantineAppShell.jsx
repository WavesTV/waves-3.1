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
    const [navOpened, { toggle: toggleNav }] = useDisclosure(true);
    const [asideOpened, { toggle: toggleAside }] = useDisclosure(true);

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
          collapsed: { mobile: !mobileOpened, desktop: !navOpened },
        }}
        aside={{
          width: 300,
          breakpoint: 'md',
          collapsed: { mobile: !mobileOpened, desktop: !asideOpened },
        }}
      >
        <AppShell.Header>
            <MantineHeader/>
        </AppShell.Header>

        <AppShell.Navbar>
        {navOpened && (
            <>
            <Group justify="right">
              <Tooltip position="right-start" label="Close Navbar">
                <ActionIcon
                  variant="light"
                  mt={11}
                  mr={11}
                  onClick={toggleNav}
                  visibleFrom="sm"
                >
                  <RiArrowLeftDoubleLine />
                </ActionIcon>
              </Tooltip>
              </Group>
            </>
          )}
            <MantineNavBar/>
        </AppShell.Navbar>

        <AppShell.Aside>
        {asideOpened && (
            <>
              <Tooltip position="right-start" label="Close Sidebar">
                <ActionIcon
                variant="light"
                  mt={11}
                  ml={11}
                  onClick={toggleAside}
                  visibleFrom="sm"
                >
                  <RiArrowRightDoubleLine />
                </ActionIcon>
              </Tooltip>
            </>
          )}
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
          <Group justify='space-between'>
      {!navOpened && (
            <Tooltip position="right-start" label="Open Navbar">
              <Group style={{ position: "fixed", zIndex: 9999 }}>
                <ActionIcon variant="light" onClick={toggleNav} visibleFrom="sm">
                  <RiArrowRightDoubleLine />
                </ActionIcon>
              </Group>
            </Tooltip>
          )}
      
        {!asideOpened && (
            <Tooltip position="right-start" label="Open Sidebar">
              <Group mr={5} justify="right" style={{ position: "fixed", zIndex: 9999, right: "1px"}}>
                <ActionIcon variant="light" onClick={toggleAside} visibleFrom="sm">
                  <RiArrowLeftDoubleLine />
                </ActionIcon>
              </Group>
            </Tooltip>
          )}

      </Group>
          <Space h="md"/>
           
              {children}
          
        </AppShell.Main>
     </AppShell>
     </>
    );
  }