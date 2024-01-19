import { getPostsStateless } from "deso-protocol";
import { useEffect, useState } from "react";
import Post from "@/components/Post";


//Waves Tab Feed Component thats displays all current livestreams
export const WavesFeed = () => {
const [wavesFeed, setWavesFeed] = useState([]);
  
useEffect(() => {
    const fetchWavesFeed = async () => {
      try {

        const followerFeedData = await getPostsStateless({
          ReaderPublicKeyBase58Check: "BC1YLfjx3jKZeoShqr2r3QttepoYmvJGEs7vbYx1WYoNmNW9FY5VUu6",
          NumToFetch: 100,
          GetPostsForFollowFeed: true,
          
        });

        // Iterate through posts and filter based on conditions
        const filteredPosts = followerFeedData.PostsFound.filter((post) => {
          const hasVideoURL = post.VideoURLs && post.VideoURLs[0] && post.VideoURLs[0].includes('https://lvpr.tv/?v=');
          return hasVideoURL;
        });

        setWavesFeed(filteredPosts);

      } catch (error) {
        console.log("Something went wrong:", error);
      }
    };

    fetchWavesFeed();
  }, []);
  


  return (
    <>
      {wavesFeed.map((post, index) => (
          <Post post={post} key={index} username={post.ProfileEntryResponse.Username}/>
        ))}
          
    </>
  );
};
