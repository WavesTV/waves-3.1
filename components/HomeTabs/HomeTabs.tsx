import { Container, Tabs, rem } from '@mantine/core';
import classes from './HomeTabs.module.css';
import { BsFire } from "react-icons/bs";
import { GiWaveCrest } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { HotFeed } from "@/components/HotFeed/HotFeed";
import { FollowerFeed } from "@/components/FollowerFeed/FollowerFeed";
import { WavesFeed } from "@/components/WavesFeed/WavesFeed";

export function HomeTabs() {
  return (
    
    <Tabs variant="unstyled" defaultValue="Waves" classNames={classes}>
      <Container>
      <Tabs.List style={{  display: 'flex', flexWrap: 'nowrap' }} grow>
        <Tabs.Tab
          value="Waves"
          leftSection={<GiWaveCrest style={{ width: rem(16), height: rem(16) }} />}
        >
          Waves
        </Tabs.Tab>
        <Tabs.Tab
          value="Following"
          leftSection={<FaUsers style={{ width: rem(16), height: rem(16) }} />}
        >
          Following
        </Tabs.Tab>
        <Tabs.Tab
          value="Hot"
          leftSection={<BsFire style={{ width: rem(16), height: rem(16) }} />}
        >
          Hot
        </Tabs.Tab>
      </Tabs.List>
     

      <Tabs.Panel value="Waves">
        <WavesFeed/>
      </Tabs.Panel>

      <Tabs.Panel value="Following">
        <FollowerFeed/>
      </Tabs.Panel>

      <Tabs.Panel value="Hot">
        <HotFeed/>
      </Tabs.Panel>
      </Container>
    </Tabs>
    
  );
}