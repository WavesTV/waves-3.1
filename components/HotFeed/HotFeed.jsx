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
