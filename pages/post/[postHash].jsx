
import { useRouter } from 'next/router'
import { useEffect, useState } from "react";
import {
  getSinglePost,
} from "deso-protocol";
import {
  Space,
  Container,
} from "@mantine/core";
import Post from "@/components/Post";

export default function PostPage() {
  const router = useRouter();
  const { postHash } = router.query;
  const [singlePost, setSinglePost] = useState({});
  const [comments, setComments] = useState([]);

  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getSinglePost({
          PostHashHex: postHash,
          CommentLimit: 50,
        });
        console.log(postData)

        setComments(postData.PostFound.Comments);
        setSinglePost(postData.PostFound);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postHash]);

  return (
    <>
    <Space h={55}/>
      <Container>
      <Post post={singlePost} username={singlePost.ProfileEntryResponse?.Username} key={singlePost.PostHashHex}/>
      </Container>   
      
        
      <Container size="sm">
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <>
           <Post  post={comment} username={comment.ProfileEntryResponse?.Username} key={comment.PostHashHex} />
          </>
        ))
      ) : (
        <>

        </>
      )}
      <Space h={111}/>
      </Container>  
    </>
  );
};