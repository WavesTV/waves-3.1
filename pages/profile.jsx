import {
  Avatar,
  Paper,
  Group,
  Text,
  Card,
  Space,
  Center,
  Divider,
  Image,
  Tabs,
  TypographyStylesProvider,
  Container,
  createStyles,
  ActionIcon,
  Tooltip,
  Button,
  Modal,
  Spoiler,
  TextInput,
  Badge,
  rem,
} from "@mantine/core";
import { GiWaveCrest } from "react-icons/gi";
import { useState, useContext, useEffect } from "react";
import { DeSoIdentityContext } from "react-deso-protocol";
import {
  getSingleProfile,
  getFollowersForUser,
  getPostsForUser,
  getNFTsForUser,
  updateProfile,
  identity,
} from "deso-protocol";
import { Stream } from "../components/Stream/Stream";
import {
  IconHeart,
  IconDiamond,
  IconRecycle,
  IconMessageCircle,
  IconSettings,
  IconScriptPlus,
  IconScriptMinus,
  IconMessageShare,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import classes from './wave/wave.module.css';
import { useRouter } from 'next/router';


export default function ProfilePage () {
 
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const { currentUser } = useContext(DeSoIdentityContext);
  const [profile, setProfile] = useState([]);
  const [posts, setPosts] = useState([]);
  const [NFTs, setNFTs] = useState([]);
  const [followerInfo, setFollowers] = useState({ followers: 0, following: 0 });
  const userPublicKey = currentUser?.PublicKeyBase58Check;
  const [newUsername, setNewUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getSingleProfile({
          PublicKeyBase58Check: userPublicKey,
        });
        const following = await getFollowersForUser({
          PublicKeyBase58Check: userPublicKey,
        });
        const followers = await getFollowersForUser({
          PublicKeyBase58Check: userPublicKey,
          GetEntriesFollowingUsername: true,
        });
        const postData = await getPostsForUser({
          PublicKeyBase58Check: userPublicKey,
          NumToFetch: 25,
        });
        const nftData = await getNFTsForUser({
          UserPublicKeyBase58Check: userPublicKey,
        });

        setNFTs(nftData.NFTsMap);
        setPosts(postData.Posts);
        setFollowers({ following, followers });
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser, userPublicKey]);

  const handleUpdateUsername = async () => {
    try {
      await updateProfile({
        UpdaterPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
        ProfilePublicKeyBase58Check: "",
        NewUsername: newUsername,
        MinFeeRateNanosPerKB: 1000,
        NewCreatorBasisPoints: 100,
        NewDescription: "",
        NewStakeMultipleBasisPoints: 12500,
      });
    } catch (error) {
      console.log("something happened: " + error);
    }

    window.location.reload();
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
      <Modal opened={opened} onClose={close} title="Update Profile" centered>
        <Paper m="md" shadow="lg" radius="sm" p="xl" withBorder>
          <Center>
            <Badge
              size="md"
              radius="sm"
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan", deg: 45 }}
            >
              Enter Username
            </Badge>

            <Space h="xs" />
          </Center>
          <Group justify="center" grow>
            <TextInput
              type="text"
              label="Username"
              value={newUsername}
              placeholder="New username"
              onChange={async (e) => {
                setNewUsername(e.target.value);
                e.preventDefault();

                let regex = /^[a-zA-Z0-9_]*$/;
                if (!regex.test(e.target.value)) {
                  setErrorMessage("Username cannot contain special characters");
                  setIsButtonDisabled(true);
                } else {
                  setErrorMessage("");

                  try {
                    const request = {
                      PublicKeyBase58Check: "",
                      Username: e.target.value,
                      NoErrorOnMissing: true,
                    };

                    try {
                      const userFound = await getSingleProfile(request);

                      if (userFound === null) {
                        setErrorMessage("");
                        setIsButtonDisabled(false);
                      } else {
                        setErrorMessage("Username is not available");
                        setIsButtonDisabled(true);
                      }
                    } catch (error) {
                      setIsButtonDisabled(true);
                      setErrorMessage("");
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }
              }}
              error={errorMessage}
            />
          </Group>

          <Space h="sm" />

          <Group justify="right">
            <Button disabled={isButtonDisabled} onClick={handleUpdateUsername}>
              Update
            </Button>
          </Group>
        </Paper>
      </Modal>

      <Divider
        my="xs"
        label={
          <>
            <Text fw={444} fz="xl">
            Profile
            </Text>
          </>
        }
        labelPosition="center"
      />

<Space h="lg"/>

      {currentUser ? (
        <>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image
                src={profile.ExtraData?.FeaturedImageURL || null}
                height={200}
                fallbackSrc="https://www.hdwallpaper.nu/wp-content/uploads/2015/07/Ocean-wave-stock-image_WEB.jpg"
              />
            </Card.Section>
            <Center>
              <Avatar
                mx="auto"
                mt={-30}
                className={classes.avatar}
                size={80}
                radius={80}
                src={
                  `https://node.deso.org/api/v0/get-single-profile-picture/${userPublicKey}` ||
                  null
                }
                alt="Profile Picture"
              />
            </Center>
            <Space h="sm" />
            <Center>
              <Text fz="lg" fw={777} variant="gradient" truncate>
                {currentUser.ProfileEntryResponse?.Username ?? currentUser.PublicKeyBase58Check}
              </Text>
            </Center>
            <Group justify="left">
            <Button variant="light" compact>
              <IconSettings onClick={open} />
            </Button>
            </Group>
            <Space h="sm" />
            

            {currentUser.ProfileEntryResponse === null ? (
              <>
                <Divider my="sm" />
                <Space h="sm" />
                <Center>
                  <Badge
                    size="md"
                    radius="sm"
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                  >
                    Go To Settings and Create A Username to Stream
                  </Badge>
                </Center>
                <Space h="sm" />
                <Divider my="sm" />
              </>
            ) : (
              <>
                <Stream />
              </>
            )}
            <Space h="sm" />

            <Paper shadow="xl" radius="md" p="xl">
              <Text
                fz="sm"
                style={{
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "wrap",
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    profile && profile.Profile && profile.Profile.Description
                      ? replaceURLs(
                          profile.Profile.Description.replace(/\n/g, "<br> ")
                        )
                      : "",
                }}
              />
            </Paper>
            <Space h="sm" />

            <Center>
              {followerInfo.followers && followerInfo.followers.NumFollowers ? (
                <Text fz="sm">
                  Followers: {followerInfo.followers.NumFollowers}
                </Text>
              ) : (
                <Text fz="sm">Followers: 0</Text>
              )}

              <Space w="sm" />
              <Divider size="sm" orientation="vertical" />
              <Space w="sm" />
              {followerInfo.following && followerInfo.following.NumFollowers ? (
                <Text fz="sm">
                  Following: {followerInfo.following.NumFollowers}
                </Text>
              ) : (
                <Text fz="sm">Following: 0</Text>
              )}
            </Center>
          </Card>

          <Space h="xl" />

          <Tabs radius="sm" defaultValue="first">
            <Tabs.List grow position="center">
              <Tabs.Tab value="first">
                <Text fz="sm">Posts</Text>
              </Tabs.Tab>

              <Tabs.Tab value="second">
                <Text fz="sm">NFTs</Text>
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="first">
              {posts && posts.length > 0 ? (
                posts.map((post, index) => (
                  <Paper
                    m="md"
                    shadow="lg"
                    radius="md"
                    p="xl"
                    withBorder
                    key={index}
                    
                  >
                    <Group justify="right">
                      <Tooltip label="Go to Post">
                        <ActionIcon
                          color="blue"
                          size="sm"
                          variant="transparent"
                          onClick={() => {
                            router.push(`/post/${post.PostHashHex}`);
                          }}
                        >
                          <IconMessageShare />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                    <Center>
                      {post.ProfileEntryResponse &&
                      post.ProfileEntryResponse.ExtraData
                        ?.LargeProfilePicURL ? (
                        <Avatar
                        radius="xl"
                        size="lg"
                          src={
                            post.ProfileEntryResponse.ExtraData
                              ?.LargeProfilePicURL
                          }
                        />
                      ) : (
                        <Avatar
                          radius="xl"
                          size="lg"
                          src={`https://node.deso.org/api/v0/get-single-profile-picture/${userPublicKey}`}
                        />
                      )}

                      <Space w="xs" />
                      <Text fw={500} size="sm">
                      {currentUser.ProfileEntryResponse?.Username ?? currentUser.PublicKeyBase58Check}
                      </Text>
                    </Center>
                    <Space h="lg" />
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
                        {post && post.Body && (
                          <Text
                            align="center"
                            size="md"
                            
                            dangerouslySetInnerHTML={{
                              __html: replaceURLs(
                                post.Body.replace(/\n/g, "<br> ")
                              ),
                            }}
                          />
                        )}
                      </TypographyStylesProvider>
                    </Spoiler>

                    <Space h="md" />
                    {post.PostExtraData?.EmbedVideoURL && (
                      <Group
                        style={{
                          height: "750px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <iframe
                          style={{
                            height: "100%",
                            border: "none",
                            borderRadius: "8px",
                          }}
                          title="embed"
                          src={post.PostExtraData.EmbedVideoURL}
                        />
                      </Group>
                    )}
                    {post.VideoURLs && (
                      <iframe
                        style={{ width: "100%", height: "100%" }}
                        title={post.PostHashHex}
                        src={post.VideoURLs}
                      />
                    )}
                    {post.ImageURLs && (
                      <Group justify="center">
                        <Image
                          src={post.ImageURLs[0]}
                          radius="md"
                          alt="post-image"
                          fit="contain"
                        />
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
                              color="blue"
                              size="sm"
                              variant="transparent"
                              onClick={() => {
                                router.push(
                                  `/post/${post.RepostedPostEntryResponse.PostHashHex}`
                                );
                              }}
                            >
                              <IconMessageShare />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                        <Center>
                          <ActionIcon
                            onClick={() => {
                              router.push(
                                `/wave/${post.RepostedPostEntryResponse.ProfileEntryResponse?.Username}`
                              );
                            }}
                            variant="transparent"
                          >
                            <Avatar
                              radius="xl"
                              size="lg"
                              src={
                                post.RepostedPostEntryResponse
                                  ?.ProfileEntryResponse?.ExtraData
                                  ?.LargeProfilePicURL ||
                                `https://node.deso.org/api/v0/get-single-profile-picture/${post.RepostedPostEntryResponse?.ProfileEntryResponse?.PublicKeyBase58Check}`
                              }
                            />

                            <Space w="xs" />
                            <Text fw={500} size="sm">
                              {
                                post.RepostedPostEntryResponse
                                  .ProfileEntryResponse?.Username
                              }
                            </Text>
                          </ActionIcon>
                        </Center>
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
                            {post.RepostedPostEntryResponse && (
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
                            )}
                          </TypographyStylesProvider>
                        </Spoiler>
                        <Space h="md" />
                        
                        {post.RepostedPostEntryResponse.PostExtraData
                          ?.EmbedVideoURL && (
                          <Group
                            style={{
                              height: "750px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <iframe
                              style={{
                                height: "100%",
                                border: "none",
                                borderRadius: "8px",
                              }}
                              title="embed"
                              src={
                                post.RepostedPostEntryResponse.PostExtraData
                                  .EmbedVideoURL
                              }
                            />
                          </Group>
                        )}
                        {post.RepostedPostEntryResponse.ImageURLs &&
                          post.RepostedPostEntryResponse.ImageURLs.length >
                            0 && (
                            <Group justify="center">
                              <Image
                                src={
                                  post.RepostedPostEntryResponse.ImageURLs[0]
                                }
                                radius="md"
                                alt="repost-image"
                                fit="contain"
                              />
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
                        <ActionIcon variant="subtle" radius="md" size={36}>
                          <IconHeart size={18} stroke={1.5} />
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
                        <ActionIcon variant="subtle" radius="md" size={36}>
                          <IconRecycle size={18} stroke={1.5} />
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
                        <ActionIcon variant="subtle" radius="md" size={36}>
                          <IconDiamond size={18} stroke={1.5} />
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
                        <ActionIcon variant="subtle" radius="md" size={36}>
                          <IconMessageCircle size={18} stroke={1.5} />
                        </ActionIcon>
                      </Tooltip>
                      <Text size="xs" c="dimmed">
                        {post.CommentCount}
                      </Text>
                    </Center>
                  </Paper>
                ))
              ) : (
                <Center>
                  <Space h="md" />

                  <Badge
                    size="md"
                    radius="sm"
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                  >
                    Post something to view them here!
                  </Badge>

                  <Space h={222} />
                </Center>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="second">
              {NFTs && Object.keys(NFTs).length > 0 ? (
                Object.keys(NFTs).map((key, index) => {
                  const nft = NFTs[key];
                  return (
                    <Paper
                      m="md"
                      shadow="lg"
                      radius="md"
                      p="xl"
                      withBorder
                      key={index}
                     
                    >
                       <Group justify="right">
                          <Tooltip label="Go to Post">
                            <ActionIcon
                              color="blue"
                              size="sm"
                              variant="transparent"
                              onClick={() => {
                                router.push(
                                  `/post/${nft.PostEntryResponse.PostHashHex}`
                                );
                              }}
                            >
                              <IconMessageShare />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      <Center>
                        <Avatar
                          size="lg"
                          radius="xl"
                          src={
                            `https://node.deso.org/api/v0/get-single-profile-picture/${userPublicKey}` ||
                            null
                          }
                          alt="Profile Picture"
                        />
                        <Space w="xs" />
                        <Text fw={500} size="sm">
                      {currentUser.ProfileEntryResponse?.Username ?? currentUser.PublicKeyBase58Check}
                        </Text>
                      </Center>
                      <Space h="lg" />
                      <TypographyStylesProvider>
                        <Text
                          align="center"
                          size="md"
                          
                          dangerouslySetInnerHTML={{
                            __html: replaceURLs(
                              nft && nft.PostEntryResponse.Body
                                ? nft.PostEntryResponse.Body.replace(
                                    /\n/g,
                                    "<br> "
                                  )
                                : ""
                            ),
                          }}
                        />
                      </TypographyStylesProvider>

                      <Space h="md" />
                      {nft.PostEntryResponse.VideoURLs && (
                        <iframe
                          style={{ width: "100%", height: "100%" }}
                          src={nft.PostEntryResponse.VideoURLs}
                          title={nft.PostEntryResponse.PostHashHex}
                        />
                      )}
                      {nft.PostEntryResponse.ImageURLs && (
                        <Group justify="center">
                          <Image
                            src={nft.PostEntryResponse.ImageURLs[0]}
                            radius="md"
                            alt="post-image"
                            fit="contain"
                          />
                        </Group>
                      )}

                      <Space h="md" />

                      <Center>
                        <Tooltip
                          transition="slide-down"
                          withArrow
                          position="bottom"
                          label="Like"
                        >
                          <ActionIcon variant="subtle" radius="md" size={36}>
                            <IconHeart size={18} stroke={1.5} />
                          </ActionIcon>
                        </Tooltip>
                        <Text size="xs" c="dimmed">
                          {nft.PostEntryResponse.LikeCount}
                        </Text>

                        <Space w="sm" />

                        <Tooltip
                          transition="slide-down"
                          withArrow
                          position="bottom"
                          label="Repost"
                        >
                          <ActionIcon variant="subtle" radius="md" size={36}>
                            <IconRecycle size={18} stroke={1.5} />
                          </ActionIcon>
                        </Tooltip>
                        <Text size="xs" c="dimmed">
                          {nft.PostEntryResponse.RepostCount}
                        </Text>

                        <Space w="sm" />

                        <Tooltip
                          transition="slide-down"
                          withArrow
                          position="bottom"
                          label="Diamonds"
                        >
                          <ActionIcon variant="subtle" radius="md" size={36}>
                            <IconDiamond size={18} stroke={1.5} />
                          </ActionIcon>
                        </Tooltip>
                        <Text size="xs" c="dimmed">
                          {nft.PostEntryResponse.DiamondCount}
                        </Text>

                        <Space w="sm" />

                        <Tooltip
                          transition="slide-down"
                          withArrow
                          position="bottom"
                          label="Comments"
                        >
                          <ActionIcon variant="subtle" radius="md" size={36}>
                            <IconMessageCircle size={18} stroke={1.5} />
                          </ActionIcon>
                        </Tooltip>
                        <Text size="xs" c="dimmed">
                          {nft.PostEntryResponse.CommentCount}
                        </Text>
                      </Center>
                    </Paper>
                  );
                })
              ) : (
                <Center>
                  <Space h="md" />

                  <Badge
                    size="md"
                    radius="sm"
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                  >
                    Mint/Buy some NFTs to view them here!
                  </Badge>

                  <Space h={222} />
                </Center>
              )}
            </Tabs.Panel>
          </Tabs>
          <Space h={77} />
        </>
      ) : (
        <>
          <Divider
            my="xs"
            label={
              <>
                <Text fw={444} fz="xl">
                  Profile
                </Text>
              </>
            }
            labelPosition="center"
          />
          <Space h="xl" />
          <Container size="30rem" px={0}>
            <Paper shadow="xl" p="lg" withBorder>
              <Center>
                <Text c="dimmed" fw={700}>
                  Please Sign Up or Login to view your Profile.
                </Text>
              </Center>
              <Space h="md" />
              <Center>
                <Button
                  fullWidth
                  leftIcon={<GiWaveCrest size="1rem" />}
                  variant="gradient"
                  gradient={{ from: "cyan", to: "indigo" }}
                  onClick={() => identity.login()}
                >
                  Sign Up
                </Button>
                <Space w="xs" />
                <Button
                  fullWidth
                  variant="default"
                  onClick={() => identity.login()}
                >
                  Login
                </Button>
              </Center>
            </Paper>
          </Container>
        </>
      )}
    </>
  );
};