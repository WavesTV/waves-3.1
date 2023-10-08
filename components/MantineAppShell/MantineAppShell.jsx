import { ActionIcon, AppShell, Container, Group, MantineProvider, Tooltip } from '@mantine/core';
import { RiArrowRightDoubleLine, RiArrowLeftDoubleLine } from 'react-icons/ri';
import { useDisclosure } from '@mantine/hooks';
import { MantineHeader } from '@/components/MantineAppShell/MantineHeader/MantineHeader';
import { MantineNavBar } from '@/components/MantineAppShell/MantineNavBar/MantineNavBar';
import { MantineAside } from '@/components/MantineAppShell/MantineAside/MantineAside';

export function MantineAppShell({ children }) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  
    return (
 
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
            <ActionIcon onClick={toggleDesktop} visibleFrom="sm"  >
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
   
        <AppShell.Main >
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
   
    );
  }