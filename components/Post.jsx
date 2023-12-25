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
    TextInput,
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
    IconHeartFilled
  } from "@tabler/icons-react";
  import { Player } from "@livepeer/react";
  import { useDisclosure } from "@mantine/hooks";
  import { notifications } from "@mantine/notifications";
  import formatDate from "@/formatDate";
  import { BsChatQuoteFill } from "react-icons/bs";
  import { BiRepost } from "react-icons/bi";

export default function Post({ post, username, key }) {
    const { currentUser } = useContext(DeSoIdentityContext);
    const [commentToggles, setCommentToggles] = useState({});
    const [commentPostHash, setCommentPostHash] = useState("");
    const [comment, setComment] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [openedImage, { open: openImage, close: closeImage }] = useDisclosure(false);
    const [openedQuote, { open: openQuote, close: closeQuote }] = useDisclosure(false); 

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
          .replace(
            urlRegex,
            (url) => `<a href="${url}" target="_blank">${url}</a>`,
          )
          .replace(atSymbolRegex, (match) => ` ${match} `);
      };


    return(
        <>
        <Modal opened={openedImage} onClose={closeImage} size="auto" centered>
          <Image src={selectedImage} radius="md" alt="post-image" fit="contain" />
        </Modal>

        <Modal opened={openedQuote} onClose={closeQuote} size="xl" centered>
          
        
        <Group style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ marginRight: '10px' }}>
            <Avatar
              variant="light"
              radius="xl"
              size="lg"
              src={`https://node.deso.org/api/v0/get-single-profile-picture/${currentUser.PublicKeyBase58Check}` || null}
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

          <Post post={post} username={username}/>

          <Group justify="right">
              <Button onClick={() =>{ 
                if (currentUser) {
                  submitQuote(); 
                } else {
                  notifications.show({
                    title: "Must be Signed In",
                    icon: <IconAlertCircle size="1.1rem" />,
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
                     maxWidth: "100%",  // Ensure message text does not overflow
                     overflow: "hidden",
                     textOverflow: "ellipsis",
                     whiteSpace: "normal",  // Allow text to wrap
                     wordWrap: "break-word",
                      textAlign: "center",  // Allow long words to break
                       }}      
                      dangerouslySetInnerHTML={{
                        __html:
                            post?.Body
                            ? replaceURLs( post.Body.replace(/\n/g, "<br> "), )
                            : "",
                      }}
                     
                    /> 
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
                      src={post.PostExtraData?.EmbedVideoURL}
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

                  <Tooltip
                    transition="slide-down"
                    withArrow
                    position="bottom"
                    label="Repost"
                  >
                    <Menu offset={2} shadow="md" width={111} withArrow>
                    <Menu.Target>
                    <ActionIcon
                      variant="subtle"
                      radius="md"
                      size={36}
                    >
                      <IconRecycle 
                        size={18}
                      />
                    </ActionIcon>
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
                          description="Your comment"
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