import { PiShootingStarLight } from "react-icons/pi";
import {
  ActionIcon,
  Text,
  Space,
  Group,
  UnstyledButton,
  Avatar,
  Center,
  Modal,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Spotlight.module.css";

export function Spotlight() {

  return (
    <>
    <Space h="md" />


        <Text fw={700} ta="center" fs="italic">
          Promoted Artists
        </Text>
        <Space h="sm" />
        <Center>
         <iframe
          style={{
            borderRadius: "14px",
          }}
          src="https://open.spotify.com/embed/album/74vEZzMxVkd08QOx4lbeRF?utm_source=generator"
          width="100%"
          height="152"
          frameBorder="0"
          
          allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
        </Center>
          <Space h="md" />
        <Center>
          <iframe
            style={{
              borderRadius: "14px",
            }}
            src="https://open.spotify.com/embed/album/4m1SepLgm4jLLnNIKK8D5v?utm_source=generator"
            width="100%"
            height="152"
            frameBorder="0"
            
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </Center>
        
        <Space h="sm" />
        
        <Text fw={700} ta="center" fs="italic">
          Powered By
        </Text>
        
        <Space h="sm" />
      <UnstyledButton
          component="a"
          href="https://www.deso.com/"
          target="_blank"
          rel="noreferrer"
          className={classes.user}
        >
          <Group>
            <Avatar
              src="https://pbs.twimg.com/profile_images/1576351999079026689/AIrcdg1J_400x400.jpg"
              radius="xl"
            />

            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                DeSo Protocol
              </Text>
            </div>
          </Group>
        </UnstyledButton>

        <UnstyledButton
          component="a"
          href="https://livepeer.org/"
          target="_blank"
          rel="noreferrer"
          className={classes.user}
        >
          <Group>
            <Avatar
              src="https://gw.ipfs-lens.dev/ipfs/bafkreieqprlwmiawdkfzlvxjsaldlctrgxq6ccjhizriqhspedb5k2imyy"
              radius="xl"
            />

            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                Livepeer
              </Text>
            </div>
          </Group>
        </UnstyledButton>


      
    </>
  );
}