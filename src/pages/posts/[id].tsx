import Layout from "@/components/Layout";
import Post from "@/components/Post/Post";
import { useAuthUser, useDoc, useDocData } from "@/fiebase/dbHooks";
import { updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const PostDetails: React.FC<any> = ({}) => {
  const router = useRouter();
  const { id } = router.query;
  const [post] = useDoc<Post>(`posts/${id}`);
  const { userId } = useAuthUser();
  console.log("🚀 ~ file: [id].tsx:13 ~ post:", post?.data(), userId);

  useEffect(() => {
    const postData = post?.data();
    const hasPost = postData?.title || postData?.department;
    console.log("🚀 ~ file: [id].tsx:17 ~ useEffect ~ postId:", post?.data());
    if (hasPost && post && userId) {
      const alreadyViewed = !!postData?.views && postData?.views[userId];
      console.log(
        "🚀 ~ file: [id].tsx:21 ~ useEffect ~ alreadyViewed:",
        alreadyViewed
      );

      if (!alreadyViewed) {
        updateDoc(post?.ref, {
          views: {
            [userId]: true,
          },
        });
      }
    }
  }, [post, userId]);
  return (
    <Layout>
      <section className="xs:px-5">
        {post && <Post doc={post} defaultShowComment />}
      </section>
    </Layout>
  );
};

export default PostDetails;
