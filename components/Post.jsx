import {
    getPostsStateless,
    getFollowersForUser,
    getExchangeRates,
    submitPost,
    createPostAssociation,
    sendDiamonds,
    getAppState
  } from "deso-protocol";
  import { useEffect, useState, useContext } from "react";
  import { DeSoIdentityContext } from "react-deso-protocol";
  import Link from 'next/link';
  import {
    Text,
    UnstyledButton,
    Avatar,
    Group,
    Slider,
    rem,
    Paper,
    Menu,
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
    IconMessageShare, IconCheck, IconX,
    IconHeartFilled,
    IconDiamondFilled
  } from "@tabler/icons-react";
  import { Player } from "@livepeer/react";
  import { useDisclosure } from "@mantine/hooks";
  import { notifications } from "@mantine/notifications";
  import formatDate from "@/formatDate";
  import { BsChatQuoteFill } from "react-icons/bs";
  import {
    getEmbedHeight,

    getEmbedWidth,
   
  } from "./EmbedUrls";

export default function Post({ post, username, key }) {
    const { currentUser } = useContext(DeSoIdentityContext);
    const [commentToggles, setCommentToggles] = useState({});
    const [commentPostHash, setCommentPostHash] = useState("");
    const [comment, setComment] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [tip, setTip] = useState(1);
    const [openedImage, { open: openImage, close: closeImage }] = useDisclosure(false);
    const [openedQuote, { open: openQuote, close: closeQuote }] = useDisclosure(false); 
    const [openedDiamonds, { open: openDiamond, close: closeDiamond }] = useDisclosure(false); 
    const [diamondLevelsUsd, setDiamondLevelsUsd] = useState([]);

    const getData = async () => {
      try {
        const appState = await getAppState({ PublicKeyBase58Check: "BC1YLjYHZfYDqaFxLnfbnfVY48wToduQVHJopCx4Byfk4ovvwT6TboD" });
    
        const desoUSD = appState.USDCentsPerDeSoCoinbase / 100;
        const nanoToDeso = 0.000000001;
        const diamondLevelMapUsd = Object.values(appState.DiamondLevelMap).map(nanos => {
          const deso = nanos * nanoToDeso;
          let usdValue = deso * desoUSD;
    
          if (usdValue < 0.01) {
            usdValue = 0.01;
          }
    
          return usdValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        });
    
        setDiamondLevelsUsd(diamondLevelMapUsd);
      } catch (error) {
        console.error('Error in getData:', error);
      }
    }
    

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

    const [quoteBody, setQuoteBody] = useState('');
    const submitQuote = async (postHash) => {
      try {
        await submitPost({
          UpdaterPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
          RepostedPostHashHex: postHash,
          BodyObj: {
            Body: quoteBody,
            VideoURLs: [],
            ImageURLs: [],
          },
        });
        notifications.show({
          title: "Success",
          icon: <IconRecycle size="1.1rem" />,
          color: "green",
          message: "Quoted!",
        });
        
      } catch (error) {
        notifications.show({
          title: "Error",
          icon: <IconX size="1.1rem" />,
          color: "red",
          message: "Something Happened!",
        });
        console.error("Error submitting Quote:", error);
      }
    };
  
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
  

    const sendDiamondTip = async (postHash, postPubKey) => {

      if (!currentUser) {
        notifications.show({
          title: "Sign In",
          icon: <IconX size="1.1rem" />,
          color: "red",
          message: `You need to sign in to tip ${username}`,
        });

        return;
      }

    try {
      await sendDiamonds({
        ReceiverPublicKeyBase58Check: postPubKey,
        SenderPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
        DiamondPostHashHex: postHash,
        DiamondLevel: tip,
        MinFeeRateNanosPerKB: 1000,
      });
        notifications.show({
          title: "Success",
          icon: <IconDiamondFilled size="1.1rem" />,
          color: "blue",
          message: `You sent ${tip} Diamonds to ${username}`,
        });

        closeDiamond();
        
      } catch (error) {
        notifications.show({
          title: "Error",
          icon: <IconX size="1.1rem" />,
          color: "red",
          message: "You already tipped this post!",
        });
        console.error("Error submitting diamond:", error);
      }
    };

    const replaceURLs = (text) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const atSymbolRegex = /@(\w+)/g; // Captures username after '@'
    
      return text
        .replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`)
        .replace(atSymbolRegex, (match, username) => `<a href="/wave/${username}" target="_blank">@${username}</a>`);
    };
    
    

  

    return(
        <>
        <Modal opened={openedImage} onClose={closeImage} size="auto" centered>
          <Image src={selectedImage} radius="md" alt="post-image" fit="contain" />
        </Modal>

        <Modal radius="xl" opened={openedDiamonds} onClose={closeDiamond} size="md" centered>
        <Text ta="center">Diamond Tip {username}'s Post</Text>

          <Group p="xl" grow h={111}>
          <Slider
            defaultValue={1}
            min={1} max={6}
            marks={[
              { value: 1, label: diamondLevelsUsd[0] },
              { value: 2, label: diamondLevelsUsd[1] },
              { value: 3, label: diamondLevelsUsd[2] },
              { value: 4, label: diamondLevelsUsd[3] },
              { value: 5, label: diamondLevelsUsd[4] },
              { value: 6, label: diamondLevelsUsd[5] },
            ]}
            value={tip} 
            onChange={setTip}
            step={1}
            label={tip}
            thumbChildren={<IconDiamondFilled size="1rem" />}
            thumbSize={26}
          />

        </Group>
        <Group justify="right" mr={22}>
          <Button onClick={() => {
            sendDiamondTip( 
              post.PostHashHex,
              post.PosterPublicKeyBase58Check);
            }} 
            leftSection={<IconDiamond size="1rem" />}>
              Tip
            </Button>
        </Group>
        </Modal>


        <Modal opened={openedQuote} onClose={closeQuote} size="xl" centered>
          
        
        <Group style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ marginRight: '10px' }}>
            <Avatar
              variant="light"
              radius="xl"
              size="lg"
              src={`https://node.deso.org/api/v0/get-single-profile-picture/${currentUser?.PublicKeyBase58Check}` || null}
              alt="Profile Picture"
              mb={20}
            />
          </div>

          <Textarea
            variant="unstyled"
            placeholder="Say some dope shit"
            size="lg"
            value={quoteBody}
            onChange={(event) => setQuoteBody(event.currentTarget.value)}
            style={{ flexGrow: 1, width: 'auto' }} // Make Textarea grow to fill space
          />
        </Group>
        <Group justify="right">
              <Button onClick={() =>{ 
                if (currentUser) {
                  submitQuote(post.PostHashHex); 
                  closeQuote();
                } else {
                  notifications.show({
                    title: "Must be Signed In",
                    icon: <IconX size="1.1rem" />,
                    color: "Red",
                    message: "Please sign in to post.",
                  });
                }
              }}
              disabled={!quoteBody.trim()}
              >
                Quote
              </Button>
          </Group>

          <Post post={post} username={username}/>

         
        </Modal>
        
            <Paper
                m="md"
                shadow="lg"
                radius="md"
                p={3}
                withBorder
                
              >
                <Space h="xs"/>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Group ml={7} justify="left">
                <Text c="dimmed" size="xs" fw={500}>
                  {formatDate(post.TimestampNanos)} ago
                </Text>
              </Group>

              <Group mr={7}  justify="right">
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
            </div>



                
              

                <Space h="sm"/>
                <Group justify="center" style={{ display: 'flex', alignItems: 'center' }}>
                  <UnstyledButton
                   component={Link}
                   href={`/wave/${username}`}
                   style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Avatar
                      radius="xl"
                      size="lg"
                      src={
                        post.ProfileEntryResponse?.ExtraData
                          ?.LargeProfilePicURL ||
                        `https://node.deso.org/api/v0/get-single-profile-picture/${post.ProfileEntryResponse?.PublicKeyBase58Check || post.PosterPublicKeyBase58Check}` ||
                        null
                      }
                    />

                    <Space w="xs" />
                    <Text fw={500} size="sm">
                    {username}
                    </Text>
                  </UnstyledButton>
              </Group>
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
                
                    <Space h="sm" />
                    <Text
                      size="md"
                      style={{
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        textAlign: "center",
                      }}      
                      dangerouslySetInnerHTML={{
                        __html: post?.Body
                          ? replaceURLs(post.Body).replace(/\n/g, "<br>")
                          : "",
                      }}
                    />
                </Spoiler>

                <Space h="md" />
                {post.PostExtraData?.EmbedVideoURL && (
                  <Group justify="center">
                  <iframe
                  title='extraembed-video'
                  id='embed-iframe'
                  className='w-full flex-shrink-0 feed-post__image'
                  height={getEmbedHeight(post.PostExtraData?.EmbedVideoURL)}
                  style={{ maxWidth: getEmbedWidth(post.PostExtraData?.EmbedVideoURL) }}
                  src={post.PostExtraData?.EmbedVideoURL}
                  frameBorder='0'
                  allow='picture-in-picture; clipboard-write; encrypted-media; gyroscope; accelerometer; encrypted-media;'
                  allowFullScreen />
                 </Group>
                    
                 
                )}

                {post.VideoURLs && (

                  <iframe
                    style={{ width: "100%", height: "100%" }}
                    src={post.VideoURLs}
                    title={post.PostHashHex}
                    allow='picture-in-picture; clipboard-write; encrypted-media; gyroscope; accelerometer; encrypted-media;'
                    allowFullScreen
                    frameBorder='0'
                  />
                )}

                {post.ImageURLs && (
                  <Group justify="center">
                    <UnstyledButton
                      onClick={() => {
                        setSelectedImage(post.ImageURLs[0]);
                        openImage();
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
                  <Post post={post.RepostedPostEntryResponse} username={post.RepostedPostEntryResponse.ProfileEntryResponse.Username}/>
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

                  
                    <Menu offset={2} shadow="md" width={111} withArrow>
                    <Menu.Target>
                    <Tooltip
                    transition="slide-down"
                    withArrow
                    position="bottom"
                    label="Repost"
                  >
                    <ActionIcon
                      variant="subtle"
                      radius="md"
                      size={36}
                    >
                      <IconRecycle 
                        size={18}
                      />
                    </ActionIcon>
                    </Tooltip>
                    </Menu.Target>

                    <Menu.Dropdown>
                    
                    <Menu.Item 
                    onClick={() =>
                        currentUser && submitRepost(post.PostHashHex)
                      } 
                    leftSection={<IconRecycle style={{ width: rem(16), height: rem(16) }} />}>
                      Repost
                    </Menu.Item>
                    
                    <Menu.Item 
                    onClick={() => openQuote()}
                    leftSection={<BsChatQuoteFill  style={{ width: rem(16), height: rem(16) }} />}>
                      Quote
                    </Menu.Item>
                
                  </Menu.Dropdown>

                    </Menu>
                  

                  
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
                      onClick={() => {
                        openDiamond();
                        getData();
                      }}
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
                  
                    {currentUser?.ProfileEntryResponse ? (
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
                          <Button mr={5} radius="md" onClick={() => submitComment()}>
                            Comment
                          </Button>
                        </Group>
                      </>
                    ) : (
                      <>
                      <Space h="md"/>
                        <Textarea
                          placeholder="Please Sign In to Comment!"
                          
                          variant="filled"
                          disabled
                        />
                        <Space h="sm" />
                        <Group justify="right">
                          <Button mr={5} radius="md" disabled>
                            Comment
                          </Button>
                        </Group>
                        
                      </>
                    )}
                   
                  </>
                </Collapse>
                <Space h="sm"/>
              </Paper>      
        
        
        </>
    )
}