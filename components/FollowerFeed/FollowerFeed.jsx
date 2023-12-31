import {
    getPostsStateless,
    getFollowersForUser,
    getIsFollowing,
    identity
  } from "deso-protocol";
  import { useEffect, useState, useContext } from "react";
  import { DeSoIdentityContext } from "react-deso-protocol";
  import Link from 'next/link';
  import {
    Text,
    Avatar,
    Group,
    Paper,
    Center,
    Space,
    ActionIcon,
    Container,
    Loader,
    Button,
    UnstyledButton
  } from "@mantine/core";
  import { Player } from "@livepeer/react";
  import { GiWaveCrest } from "react-icons/gi";
  import Post from "@/components/Post";
  
  export const FollowerFeed = () => {
    const { currentUser, isLoading } = useContext(DeSoIdentityContext);
    const [followerFeed, setFollowerFeed] = useState([]);
    const [followingWaves, setFollowingWaves] = useState([]);
    const [filteredWaves, setFilteredWaves] = useState([]);
    const [waves, setWaves] = useState([]);
    const userPublicKey = currentUser?.PublicKeyBase58Check;


    useEffect(() => {
      const fetchFollowerFeed = async () => {
        try {
          const followerFeedData = await getPostsStateless({
            ReaderPublicKeyBase58Check: userPublicKey,
            NumToFetch: 100,
            GetPostsForFollowFeed: true,
            FetchSubcomments: true,
            
          });
  
          setFollowerFeed(followerFeedData.PostsFound);
        } catch (error) {
          console.error("Error fetching user hotFeed:", error);
        }
      };
  
      const fetchWaves = async () => {
        try {
          //Getting Profiles that are following the Waves_Streams Account
          const resultWaves = await getFollowersForUser({
            Username: "Waves_Streams",
            GetEntriesFollowingUsername: true,
            //Will have to increase as the followers increase
            NumToFetch: 20,
          });
  
          setWaves(Object.values(resultWaves.PublicKeyToProfileEntry));
        } catch (error) {
        
        }
      };
  
      if (currentUser) {
        fetchFollowerFeed();
        fetchWaves();
      }
    }, [currentUser, userPublicKey]);
  
    // Filtering the waves array based on conditions
    const filterWaves = () => {
      const filtered = waves.filter(
        (post) =>
          post.ExtraData?.WavesStreamPlaybackId &&
          post.ExtraData?.WavesStreamPlaybackId !== "" &&
          post.ExtraData?.WavesStreamTitle &&
          post.ExtraData?.WavesStreamTitle !== ""
      );
      
      setFilteredWaves(filtered);
    };
  
    // Call the filterWaves function whenever the waves array updates
    useEffect(() => {
      filterWaves();
    }, [waves]);
  
    // Check if the current user is following the profiles in filteredPosts
    const fetchFollowingPosts = async () => {
      const followingPosts = [];
      for (const post of filteredWaves) {
        const request = {
          PublicKeyBase58Check: currentUser.PublicKeyBase58Check,
          IsFollowingPublicKeyBase58Check: post.PublicKeyBase58Check,
        };
        const response = await getIsFollowing(request);
        if (response.IsFollowing === true) {
          followingPosts.push(post);
        }
      }
      setFollowingWaves(followingPosts);
    };
  
    useEffect(() => {
      if (currentUser) {
        fetchFollowingPosts();
      }
    }, [filteredWaves]);
  
   
    return (
      <>
        <div>
          {currentUser &&
            followingWaves &&
            followingWaves.length > 0 &&
            followingWaves.map((post) => {
              if (
                post.PublicKeyBase58Check === currentUser.PublicKeyBase58Check
              ) {
                return null; // Exclude current user from the list
              }
  
              return (
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
                    playbackId={post.ExtraData.WavesStreamPlaybackId}
                    title={post.ExtraData.WavesStreamTitle}
                    
                  />
                </Paper>
              );
            })}
        </div>
  
        <div>
          {currentUser ? (
            followerFeed && followerFeed.length > 0 ? (
              followerFeed.map((post) => (
                <Post post={post} username={post.ProfileEntryResponse?.Username} key={post.PostHashHex} />
        
              ))
            ) : (
              <>
                {isLoading ? (
                  <>
                  <Space h="md" />
                  <Group justify="center">
                  <Loader />
                  </Group>
                  </>
                ) : (
                  <>
            <Space h="md" />
            <Container size="30rem" px={0}>
            <Paper shadow="xl" p="lg" withBorder>
              <Center>
                <Text size="md" fw={400}>
                  Follow some creators to view their posts here!
                </Text>
              </Center>
            
            </Paper>
          </Container>
          </>
                )}
                <Space h={222} />
              </>
            )
          ) : (
            <>
            <Space h="md" />
            <Container size="30rem" px={0}>
            <Paper shadow="xl" p="lg" withBorder>
              <Center>
                <Text size="md" fw={400}>
                  Sign In to view your Following Feed.
                </Text>
              </Center>
              <Space h="md" />

              <Button
                fullWidth
                leftSection={<GiWaveCrest size="1rem" />}
                variant="gradient"
                gradient={{ from: "cyan", to: "indigo" }}
                onClick={() => {
                  identity
                    .login({
                      getFreeDeso: true,
                    })
                    .catch((err) => {
                      if (err?.type === ERROR_TYPES.NO_MONEY) {
                        alert("You need DESO in order to post!");
                      } else {
                        alert(err);
                      }
                    });
                }}
              >
                Sign In
              </Button>
            </Paper>
          </Container>
          </>
          )}
        </div>

      </>
    );
  };