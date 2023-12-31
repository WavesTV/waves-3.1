import { getFollowersForUser } from "deso-protocol";
import { useEffect, useState } from "react";
import { Player } from "@livepeer/react";
import {
  Text,
  Avatar,
  UnstyledButton,
  Badge,

  Paper,

  Center,
  Space,
  Group,
  Tooltip,
  Image,
  Loader,
} from "@mantine/core";
import Link from 'next/link';


//Waves Tab Feed Component thats displays all current livestreams
export const WavesFeed = () => {
  

  const [wavesFeed, setWavesFeed] = useState([]);
  
useEffect(() => {
    const fetchWavesFeed = async () => {
      try {
          
        //Getting Profiles that are following the Waves_Streams Account
        const result = await getFollowersForUser({
          Username: "Waves_Streams",
          GetEntriesFollowingUsername: true, 
          //Will have to increase as the followers increase
          NumToFetch: 20,
        });
       
        
        setWavesFeed(Object.values(result.PublicKeyToProfileEntry))
      } catch (error) {
        console.log("Something went wrong:", error);
      }
    };

    fetchWavesFeed();
  }, []);
  
  // Filter the posts that have non-empty WavesStreamPlaybackId and WavesStreamTitle
  const filteredPosts = wavesFeed.filter(
    (post) =>
      post.ExtraData?.WavesStreamPlaybackId &&
      post.ExtraData?.WavesStreamPlaybackId !== "" &&
      post.ExtraData?.WavesStreamTitle &&
      post.ExtraData?.WavesStreamTitle !== ""
  );

//Map through the filteredPosts to display the current livestreams 
   // Render the filtered posts or the "No Waves" message
  return (
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

      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <>
            <Paper
              m="md"
              shadow="lg"
              radius="md"
              withBorder
              key={post.PublicKeyBase58Check}
             
            >
              <Space h="sm" />
              <Center>
                <UnstyledButton
                 component={Link}
                 href={`/wave/${post.Username}`}
                >
                   
              <Group justify="center">
                  <Avatar
                    radius="xl"
                    size="lg"
                    src={
                      post.ExtraData?.LargeProfilePicURL ||
                      `https://node.deso.org/api/v0/get-single-profile-picture/${post.PublicKeyBase58Check}` ||
                      null
                    }
                  />
               
                  <Text fw={500} size="md">
                    {post.Username}
                  </Text>
                  </Group>
                </UnstyledButton>
              </Center>
              <Space h="md" />
              <Player
              priority 
              controls={{ autohide: 0, hotkeys: false, defaultVolume: 0.6 }}
              showPipButton
              theme={{
                  colors: {
                    loading: '#3cdfff',
                  }
                }}
              style={{ width: '100%' }}
                playbackId={post.ExtraData.WavesStreamPlaybackId}
                title={post.ExtraData.WavesStreamTitle}
                
              />
               <Space h="sm" />
            </Paper>
          </>
        ))
      ) : (
        <Center>
              
        <Badge
                  size="md"
                  radius="sm"
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                >
            No Waves Right Now.
         
        </Badge>
        <Space h={222} />
            </Center>
      )}
    </div>
  );
};