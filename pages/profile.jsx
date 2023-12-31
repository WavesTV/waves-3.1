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
  Loader,
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
import Post from "@/components/Post";

export default function ProfilePage () {
  const [isLoading, setIsLoading] = useState(false);
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
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);

  const getProfile = async () => {
    try {
      const profileData = await getSingleProfile({
        PublicKeyBase58Check: userPublicKey,
      });


      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  const getFollowers = async () => {
    try {
      const following = await getFollowersForUser({
        PublicKeyBase58Check: userPublicKey,
      });
      const followers = await getFollowersForUser({
        PublicKeyBase58Check: userPublicKey,
        GetEntriesFollowingUsername: true,
      });

      setFollowers({ following, followers });

    } catch (error) {
      console.error("Error fetching follower data:", error);
    }
  }

  const getPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const postData = await getPostsForUser({
        PublicKeyBase58Check: userPublicKey,
        NumToFetch: 25,
      });

      setPosts(postData.Posts);
      setIsLoadingPosts(false)
    } catch (error) {
      console.error("Error fetching user profile posts:", error);
      setIsLoadingPosts(false)
    }
    
  }

  const getNFTs = async () => {
    try {
      setIsLoadingNFTs(true);
      const nftData = await getNFTsForUser({
        UserPublicKeyBase58Check: userPublicKey,
      });

      setNFTs(nftData.NFTsMap);
      setIsLoadingNFTs(false);
    } catch (error) {
      console.error("Error fetching user nfts:", error);
      setIsLoadingNFTs(false);
    }
    
  }

  useEffect(() => {
    if (currentUser) {
      getProfile();
      getFollowers();
      getPosts();
      getNFTs();
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
    const atSymbolRegex = /@(\w+)/g; // Captures username after '@'
  
    return text
      .replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`)
      .replace(atSymbolRegex, (match, username) => `<a href="/wave/${username}" target="_blank">@${username}</a>`);
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
                fallbackSrc="https://images.deso.org/4903a46ab3761c5d8bd57416ff411ff98b24b35fcf5480dde039eb9bae6eebe0.webp"
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
            <Button variant="light" compact onClick={open} >
              <IconSettings />
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
                          profile.Profile.Description.replace(/\n/g, "<br>")
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
            {isLoadingPosts ? (
  <>
    <Space h="md"/>
    <Center>
      <Loader variant="bars" />
    </Center>
  </>
) : (
  posts && posts.length > 0 ? (
    posts.map((post) => (
      <Post post={post} username={currentUser.ProfileEntryResponse?.Username} key={post.PostHashHex} />
    ))
  ) : (
    // If no NFTs, show the Badge
    <>
      <Space h="md"/>
      <Center>
        <Badge
          size="md"
          radius="sm"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan", deg: 45 }}
        >
          Post something to view them here!
        </Badge>
      </Center>
    </>
  )
)}


          
                   <Space h={222} />
            </Tabs.Panel>

            <Tabs.Panel value="second">
            {isLoadingNFTs ? (
  <>
    <Space h="md"/>
    <Center>
      <Loader variant="bars" />
    </Center>
  </>
) : (
  // After loading, check if there are NFTs to display
  NFTs && Object.keys(NFTs).length > 0 ? (
    Object.keys(NFTs).map((key, index) => {
      const nft = NFTs[key];
      return (
        <Post post={nft.PostEntryResponse} username={nft.PostEntryResponse.ProfileEntryResponse.Username} key={nft.PostEntryResponse.PostHashHex}/>
      );
    })
  ) : (
    // If no NFTs, show the Badge
    <>
      <Space h="md"/>
      <Center>
        <Badge
          size="md"
          radius="sm"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan", deg: 45 }}
        >
          Mint something to view them here!
        </Badge>
      </Center>
    </>
  )
)}


           

              
            </Tabs.Panel>
          </Tabs>
          <Space h={222} />
        </>
      ) : (
        <>
          <Container size="30rem" px={0}>
            <Paper shadow="xl" p="lg" withBorder>
              <Center>
                <Text c="dimmed" fw={700}>
                  Please Sign Up or Sign In to view your Profile.
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
                  Sign In
                </Button>
              </Center>
            </Paper>
          </Container>
        </>
      )}
    </>
  );
};