import { getHotFeed } from "deso-protocol";
import { useEffect, useState } from "react";
import {
    Center,
    Space,
    Loader,
    Paper,
    UnstyledButton,
    Group,
    Avatar,
    Text
  } from "@mantine/core";
import Post from "@/components/Post";
import { Player } from "@livepeer/react";
import Link from 'next/link';

  export const HotFeed = () => {
    const [hotFeed, setHotFeed] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
      const fetchHotFeed = async () => {
        try {
          setIsLoading(true);
          const hotFeed = await getHotFeed({
            ResponseLimit: 100,
          });
       
          setHotFeed(hotFeed.HotFeedPage);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching user hotFeed:", error);
        }
      };
  
      fetchHotFeed();
    }, []);
    
  
  
  
    return (
      <>
        <div>
        <Paper m="md" shadow="lg" radius="md" withBorder>
            <Space h="sm" />
              <Center>
              <UnstyledButton component={Link}
                 href="/wave/waves_streaming" >
              <Group justify="center">
                <Avatar
                  src="https://node.deso.org/api/v0/get-single-profile-picture/BC1YLjYHZfYDqaFxLnfbnfVY48wToduQVHJopCx4Byfk4ovvwT6TboD"
                  radius="xl"
                  size="lg"
                />
                <Text fw={600} size="sm">
                  Waves_Streaming
                </Text>
                </Group>
              </UnstyledButton>
              </Center>
            <Space h="md" />
            <Player 
            playbackId="ca57j651up688am0" 
            title="type shi" 
            priority 
            controls={{ autohide: 0, hotkeys: false, defaultVolume: 0.6 }}
            showPipButton
            theme={{
                colors: {
                  loading: '#3cdfff',
                }
              }}
                />
           <Space h="sm" />
          </Paper>

          {isLoading ? (
            <Center>
              <Loader variant="bars" />
            </Center>
          ) : (
            hotFeed.map((post) => (
              <Post post={post} username={post.ProfileEntryResponse?.Username} key={post.PostHashHex} />
            ))
          )}
  
          <Space h={222} />
        </div>
  

      </>
    );
  };