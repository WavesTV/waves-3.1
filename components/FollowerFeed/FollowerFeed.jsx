import {
    getPostsStateless,
    getFollowersForUser,
    getIsFollowing,
    submitPost,
    createPostAssociation,
    sendDiamonds,
  } from "deso-protocol";
  import { useEffect, useState, useContext } from "react";
  import { DeSoIdentityContext } from "react-deso-protocol";
  import Link from 'next/link';
  import {
    Text,
    UnstyledButton,
    Avatar,
    Group,
    Badge,
    createStyles,
    Paper,
    TypographyStylesProvider,
    Center,
    Space,
    ActionIcon,
    Tooltip,
    Image,
    Loader,
    Button,
    Textarea,
    Collapse,
    Modal,
    Spoiler,
  } from "@mantine/core";
  import {
    IconHeart,
    IconScriptPlus,
    IconScriptMinus,
    IconDiamond,
    IconRecycle,
    IconMessageCircle,
    IconMessageShare, IconCheck, IconX, IconThumbUp,
    IconHeartFilled
  } from "@tabler/icons-react";
 
  import { Player } from "@livepeer/react";
  import { useDisclosure } from "@mantine/hooks";
  import { notifications } from "@mantine/notifications";
  
  
  export const FollowerFeed = () => {
  
    const { currentUser, isLoading } = useContext(DeSoIdentityContext);
    const [followerFeed, setFollowerFeed] = useState([]);
    const [followingWaves, setFollowingWaves] = useState([]);
    const [filteredWaves, setFilteredWaves] = useState([]);
    const [waves, setWaves] = useState([]);
    const userPublicKey = currentUser?.PublicKeyBase58Check;
    const [selectedImage, setSelectedImage] = useState("");
    const [opened, { open, close }] = useDisclosure(false);
    useEffect(() => {
      const fetchFollowerFeed = async () => {
        try {
          const followerFeedData = await getPostsStateless({
            ReaderPublicKeyBase58Check: userPublicKey,
            NumToFetch: 30,
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
          console.log("Something went wrong:", error);
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
  
    const [commentToggles, setCommentToggles] = useState({});
    const [commentPostHash, setCommentPostHash] = useState("");
    const [comment, setComment] = useState("");
  
    const handleCommentToggle = (postHash) => {
      setCommentPostHash(postHash);
      setCommentToggles((prevState) => ({
        ...prevState,
        [postHash]: !prevState[postHash],
      }));
    };
  
    const submitComment = async () => {
      try {
        await submitPost({
          UpdaterPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
          ParentStakeID: commentPostHash,
          BodyObj: {
            Body: comment,
            VideoURLs: [],
            ImageURLs: [],
          },
        });
  
     
        notifications.show({
          title: "Success",
          icon: <IconCheck size="1.1rem" />,
          color: "green",
          message: "Your comment was submitted!",
        });
      } catch (error) {
        notifications.show({
          title: "Error",
          icon: <IconX size="1.1rem" />,
          color: "red",
          message: "Something Happened!",
        });
        console.error("Error submitting comment:", error);
      }
  
      // Reset the comment state after submitting
      setComment("");
    };
  
    const [repostSuccess, setRepostSuccess] = useState(false);
    const [currentPostHash, setCurrentPostHash] = useState("");
    const submitRepost = async (postHash) => {
      try {
        await submitPost({
          UpdaterPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
          RepostedPostHashHex: postHash,
          BodyObj: {
            Body: "",
            VideoURLs: [],
            ImageURLs: [],
          },
        });
        notifications.show({
          title: "Success",
          icon: <IconRecycle size="1.1rem" />,
          color: "green",
          message: "Reposted!",
        });
        setRepostSuccess(true);
        setCurrentPostHash(postHash);
      } catch (error) {
        notifications.show({
          title: "Error",
          icon: <IconX size="1.1rem" />,
          color: "red",
          message: "Something Happened!",
        });
        console.error("Error submitting Repost:", error);
      }
    };
  
    const [heartSuccess, setHeartSuccess] = useState(false);
    const [currentHeartPostHash, setCurrentHeartPostHash] = useState("");
    const submitHeart = async (postHash) => {
      try {
        await createPostAssociation({
          TransactorPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
          PostHashHex: postHash,
          AssociationType: "REACTION",
          AssociationValue: "LIKE",
          MinFeeRateNanosPerKB: 1000,
        });
        notifications.show({
          title: "Success",
          icon: <IconHeartFilled size="1.1rem" />,
          color: "blue",
          message: "Liked!",
        });
        setHeartSuccess(true);
        setCurrentHeartPostHash(postHash);
      } catch (error) {
        notifications.show({
          title: "Error",
          icon: <IconX size="1.1rem" />,
          color: "red",
          message: "Something Happened!",
        });
        console.error("Error submitting heart:", error);
      }
    };
  
    const [diamondTipSuccess, setDiamondTipSuccess] = useState(false);
    const [currentDiamondPostHash, setCurrentDiamondPostHash] = useState("");
  
    const sendDiamondTip = async (postHash, postPubKey) => {
      setCurrentDiamondPostHash(postHash);
  
      try {
        await sendDiamonds({
          ReceiverPublicKeyBase58Check: postPubKey,
          SenderPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
          DiamondPostHashHex: postHash,
          DiamondLevel: 1,
          MinFeeRateNanosPerKB: 1000,
        });
        notifications.show({
          title: "Success",
          icon: <IconDiamond size="1.1rem" />,
          color: "blue",
          message: "Diamond Sent!",
        });
        setDiamondTipSuccess(true);
      } catch (error) {
        notifications.show({
          title: "Error",
          icon: <IconX size="1.1rem" />,
          color: "red",
          message: "Something Happened!",
        });
        console.error("Error submitting diamond:", error);
      }
    };

    const replaceURLs = (text) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const atSymbolRegex = /(\S*@+\S*)/g;
  
      return text
        .replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`)
        .replace(atSymbolRegex, (match) => ` ${match} `);
    };
  
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
                  p="xl"
                  withBorder
                  key={post.PublicKeyBase58Check}
                  
                >
                  <Center>
                    <ActionIcon
                    component={Link}
                    href={`/wave/${post.Username}`}
                    variant="transparent"
                    >
                      <Avatar
                        radius="xl"
                        size="lg"
                        src={
                          post.ExtraData?.LargeProfilePicURL ||
                          `https://node.deso.org/api/v0/get-single-profile-picture/${post.PublicKeyBase58Check}` ||
                          null
                        }
                      />
                      <Space w="xs" />
                      <Text fw={500} size="md">
                        {post.Username}
                      </Text>
                    </ActionIcon>
                  </Center>
                  <Space h="xl" />
                  <Player
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
                
                <Paper
                m="md"
                shadow="lg"
                radius="md"
                p="xl"
                withBorder
                key={post.PostHashHex}
              >
                <Group justify="right">
                  <Tooltip label="Go to Post">
                    <ActionIcon
                      color="blue"
                      size="sm"
                      variant="transparent"
                      component={Link}
                      href={`/post/${post.PostHashHex}`}
                    >
                      <IconMessageShare />
                    </ActionIcon>
                  </Tooltip>
                </Group>
                <Center>
                  <ActionIcon
                   component={Link}
                   href={`/wave/${post.ProfileEntryResponse.Username}`}
                   variant="transparent"
                  >
                    <Avatar
                      radius="xl"
                      size="lg"
                      src={
                        post.ProfileEntryResponse.ExtraData
                          ?.LargeProfilePicURL ||
                        `https://node.deso.org/api/v0/get-single-profile-picture/${post.ProfileEntryResponse.PublicKeyBase58Check}` ||
                        null
                      }
                    />

                    <Space w="xs" />
                    <Text fw={500} size="sm">
                      {post.ProfileEntryResponse.Username}
                    </Text>
                  </ActionIcon>
                </Center>
                <Space h="xl" />
                <Spoiler
                  maxHeight={222}
                  showLabel={
                    <>
                      <Space h="xs" />
                      <Tooltip label="Show More">
                        <IconScriptPlus />
                      </Tooltip>
                    </>
                  }
                  hideLabel={
                    <>
                      <Space h="xs" />
                      <Tooltip label="Show Less">
                        <IconScriptMinus />
                      </Tooltip>
                    </>
                  }
                >
                  <TypographyStylesProvider>
                    <Space h="sm" />
                    <Text
                      ta="center"
                      size="md"
                      
                      dangerouslySetInnerHTML={{
                        __html: replaceURLs(post.Body.replace(/\n/g, "<br> ")),
                      }}
                    />
                  </TypographyStylesProvider>
                </Spoiler>

                <Space h="md" />
                {post.PostExtraData?.EmbedVideoURL && (
                  <Group  style={{
                   
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                        <iframe
                          style={{
                            height: "50vh",
                            width: "100vw",
                            border: "none",
                            borderRadius: "22px",
                          }}
                      title="embed"
                      src={post.PostExtraData.EmbedVideoURL}
                    />
                  </Group>
                )}
                {post.VideoURLs && (
                  <iframe
                    style={{ width: "100%", height: "100%" }}
                    src={post.VideoURLs}
                    title={post.PostHashHex}
                  />
                )}

                {post.ImageURLs && (
                  <Group justify="center">
                    <UnstyledButton
                      onClick={() => {
                        setSelectedImage(post.ImageURLs[0]);
                        open();
                      }}
                    >
                      <Image
                        src={post.ImageURLs[0]}
                        radius="md"
                        alt="post-image"
                        fit="contain"
                      />
                    </UnstyledButton>
                  </Group>
                )}
                {post.RepostedPostEntryResponse && (
                  <Paper
                    m="md"
                    shadow="lg"
                    radius="md"
                    p="xl"
                    withBorder
                    key={post.RepostedPostEntryResponse.PostHashHex}
                    
                  >
                    <Group justify="right">
                      <Tooltip label="Go to Post">
                        <ActionIcon
                         component={Link}
                         href={`/post/${post.PostHashHex}`}
                         color="blue"
                         size="sm"
                         variant="transparent"
                        >
                          <IconMessageShare />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                    <Center>
                      <ActionIcon
                      component={Link}
                      href={`/wave/${post.ProfileEntryResponse.Username}`}
                      variant="transparent"
                      >
                        <Avatar
                          radius="xl"
                          size="lg"
                          src={
                            post.RepostedPostEntryResponse?.ProfileEntryResponse
                              ?.ExtraData?.LargeProfilePicURL ||
                            `https://node.deso.org/api/v0/get-single-profile-picture/${post.RepostedPostEntryResponse?.ProfileEntryResponse?.PublicKeyBase58Check}`
                          }
                        />

                        <Space w="xs" />
                        <Text fw={500} size="sm">
                          {
                            post.RepostedPostEntryResponse.ProfileEntryResponse
                              ?.Username
                          }
                        </Text>
                      </ActionIcon>
                    </Center>
                    <Space h="xl" />
                    <Spoiler
                      maxHeight={222}
                      showLabel={
                        <>
                          <Space h="xs" />
                          <Tooltip label="Show More">
                            <IconScriptPlus />
                          </Tooltip>
                        </>
                      }
                      hideLabel={
                        <>
                          <Space h="xs" />
                          <Tooltip label="Show Less">
                            <IconScriptMinus />
                          </Tooltip>
                        </>
                      }
                    >
                      <TypographyStylesProvider>
                        <Space h="sm" />
                        <Text
                          ta="center"
                          size="md"
                          
                          dangerouslySetInnerHTML={{
                            __html: replaceURLs(
                              post.RepostedPostEntryResponse.Body.replace(
                                /\n/g,
                                "<br> "
                              )
                            ),
                          }}
                        />
                      </TypographyStylesProvider>
                    </Spoiler>

                    <Space h="md" />
                    {post.RepostedPostEntryResponse.PostExtraData
                      ?.EmbedVideoURL && (
                       <Group  style={{
                   
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                        <iframe
                          style={{
                            height: "50vh",
                            width: "100vw",
                            border: "none",
                            borderRadius: "22px",
                          }}
                          title="embed"
                          src={
                            post.RepostedPostEntryResponse.PostExtraData
                              .EmbedVideoURL
                          }
                        />
                      </Group>
                    )}
                    {post.RepostedPostEntryResponse.VideoURLs && (
                      <iframe
                        style={{ width: "100%", height: "100%" }}
                        src={post.RepostedPostEntryResponse.VideoURLs}
                        title={post.RepostedPostEntryResponse.PostHashHex}
                      />
                    )}
                    {post.RepostedPostEntryResponse.ImageURLs &&
                      post.RepostedPostEntryResponse.ImageURLs.length > 0 && (
                        <Group justify="center">
                          <UnstyledButton
                            onClick={() => {
                              setSelectedImage(
                                post.RepostedPostEntryResponse.ImageURLs[0]
                              );
                              open();
                            }}
                          >
                            <Image
                              src={post.RepostedPostEntryResponse.ImageURLs[0]}
                              radius="md"
                              alt="repost-image"
                              fit="contain"
                            />
                          </UnstyledButton>
                        </Group>
                      )}
                  </Paper>
                )}

                <Space h="md" />

                <Center>
                  <Tooltip
                    transition="slide-down"
                    withArrow
                    position="bottom"
                    label="Like"
                  >
                    <ActionIcon
                      onClick={() =>
                        currentUser && submitHeart(post.PostHashHex)
                      }
                      variant="subtle"
                      radius="md"
                      size={36}
                    >
                      <IconHeart
                        size={18} 
                      />
                    </ActionIcon>
                  </Tooltip>
                  <Text size="xs" c="dimmed">
                    {post.LikeCount}
                  </Text>

                  <Space w="sm" />

                  <Tooltip
                    transition="slide-down"
                    withArrow
                    position="bottom"
                    label="Repost"
                  >
                    <ActionIcon
                      onClick={() =>
                        currentUser && submitRepost(post.PostHashHex)
                      }
                      variant="subtle"
                      radius="md"
                      size={36}
                    >
                      <IconRecycle
                        size={18}
                      />
                    </ActionIcon>
                  </Tooltip>
                  <Text size="xs" c="dimmed">
                    {post.RepostCount}
                  </Text>

                  <Space w="sm" />

                  <Tooltip
                    transition="slide-down"
                    withArrow
                    position="bottom"
                    label="Diamonds"
                  >
                    <ActionIcon
                      onClick={() =>
                        currentUser &&
                        sendDiamondTip(
                          post.PostHashHex,
                          post.PosterPublicKeyBase58Check
                        )
                      }
                      variant="subtle"
                      radius="md"
                      size={36}
                    >
                      <IconDiamond
                        size={18}
                      />
                    </ActionIcon>
                  </Tooltip>
                  <Text size="xs" c="dimmed">
                    {post.DiamondCount}
                  </Text>

                  <Space w="sm" />

                  <Tooltip
                    transition="slide-down"
                    withArrow
                    position="bottom"
                    label="Comments"
                  >
                    <ActionIcon
                      onClick={() => handleCommentToggle(post.PostHashHex)}
                      variant="subtle"
                      radius="md"
                      size={36}
                    >
                      <IconMessageCircle size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Text size="xs" c="dimmed">
                    {post.CommentCount}
                  </Text>
                </Center>
                <Collapse in={commentToggles[post.PostHashHex]}>
                  <>
                    {currentUser && currentUser.ProfileEntryResponse ? (
                      <>
                      <Space h="md"/>
                        <Textarea
                          placeholder="Enter your comment..."
                          variant="filled"
                          value={comment}
                          onChange={(event) => setComment(event.target.value)}
                        />
                        <Space h="sm" />
                        <Group justify="right">
                          <Button radius="md" onClick={() => submitComment()}>
                            Comment
                          </Button>
                        </Group>
                      </>
                    ) : (
                      <>
                        <Textarea
                          placeholder="Please Login/Signup or Set username to Comment."
                          description="Your comment"
                          variant="filled"
                          disabled
                        />
                        <Space h="sm" />
                        <Group justify="right">
                          <Button radius="md" disabled>
                            Comment
                          </Button>
                        </Group>
                      </>
                    )}
                  </>
                </Collapse>
              </Paper>       
              ))
            ) : (
              <Center>
                <Space h="md" />
                {isLoading ? (
                  <Loader variant="bars" />
                ) : (
                  <Badge
                    size="md"
                    radius="sm"
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                  >
                    No posts found in the follower feed.
                  </Badge>
                )}
                <Space h={222} />
              </Center>
            )
          ) : (
            <Center>
              <Space h="md" />
  
              <Badge
                size="md"
                radius="sm"
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
              >
                Please login to view your Follower Feed.
              </Badge>
  
              <Space h={222} />
            </Center>
          )}
        </div>
  
        <Modal opened={opened} onClose={close} size="auto" centered>
          <Image src={selectedImage} radius="md" alt="post-image" fit="contain" />
        </Modal>
      </>
    );
  };