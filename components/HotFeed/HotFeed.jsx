import { getHotFeed } from "deso-protocol";
import { useEffect, useState } from "react";
import {
    Center,
    Space,
    Loader,
  } from "@mantine/core";
import Post from "@/components/Post";

  export const HotFeed = () => {
    const [hotFeed, setHotFeed] = useState([]);

    useEffect(() => {
      const fetchHotFeed = async () => {
        try {
          const hotFeed = await getHotFeed({
            ResponseLimit: 30,
          });
  
          setHotFeed(hotFeed.HotFeedPage);
        } catch (error) {
          console.error("Error fetching user hotFeed:", error);
        }
      };
  
      fetchHotFeed();
    }, []);
    
    console.log(hotFeed)
  
  
    return (
      <>
        <div>
          {hotFeed && hotFeed.length > 0 ? (
            hotFeed.map((post) => (
              <>
              <Post post={post} username={post.ProfileEntryResponse?.Username} key={post.PostHashHex} />
              </>
            ))
          ) : (
            <Center>
              <Loader variant="bars" />
            </Center>
          )}
  
          <Space h={222} />
        </div>
  

      </>
    );
  };