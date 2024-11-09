import {
  useCol,
  setData,
  useDocData,
  useImage,
  useAuthUser,
  deleteData,
} from "@/fiebase/dbHooks";
import {
  DocumentSnapshot,
  orderBy,
  limit,
  updateDoc,
  Timestamp,
  where,
  writeBatch,
  collection,
  query,
  getDocs,
} from "firebase/firestore";
import { useRef, useState, SyntheticEvent } from "react";
import { useRouter } from "next/router";
import {
  FaEllipsisV,
  FaFileAlt,
  FaThumbsUp,
  FaThumbsDown,
  FaRegPaperPlane,
  FaUserSecret,
  FaCommentAlt,
} from "react-icons/fa";
import AddPostModal from "./PostModal";
import toast from "react-hot-toast";
import Comment from "./Comment";
import { useRecoilValue } from "recoil";
import { activeClosureAtom, LoggedInUserAtom } from "@/state";
import { db } from "@/fiebase/db";

const DeleteModal = ({ postId, domId }: any) => {
  const router = useRouter();
  const isMightbeDetailpage = router.pathname.includes("posts");

  const deletePost = async (e: SyntheticEvent) => {
    e.stopPropagation();
    try {
      await deleteData(`posts/${postId}`);

      const ref = await collection(db, "comments");
      const q = await query(ref, where("postId", "==", postId));
      const batch = writeBatch(db);

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        batch.delete(doc.ref);
      });
      await batch.commit();
      toast.success("Deleted Successfully ");

      // if (isMightbeDetailpage) return router.push("/");
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };

  return (
    <>
      <input
        type="checkbox"
        onChange={(e) => e.stopPropagation()}
        id={`${domId}`}
        className="modal-toggle"
      />
      <label
        onChange={(e) => e.stopPropagation()}
        htmlFor={`${domId}`}
        className="modal cursor-pointer"
      >
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">
            Are you sure that you want to delete your post?
          </h3>
          <div className="mt-10 flex justify-end gap-4">
            <label
              onClick={(e) => e.stopPropagation()}
              htmlFor={`${domId}`}
              className=" btn-error btn"
            >
              Cancel
            </label>
            <label
              onClick={deletePost}
              htmlFor={`${domId}`}
              className="btn-primary btn"
            >
              Delete
            </label>
          </div>
        </label>
      </label>
    </>
  );
};

const UserInfo = ({
  id,
  createdAt,
  anonymous,
  postId,
  domId,
}: {
  id: string;
  createdAt: Timestamp;
  anonymous: boolean;
  postId: string;
  domId: string;
}) => {
  const [value] = useDocData<{
    name: string;
    img: string;
  }>("users/" + id);
  const dateData = `${createdAt.toDate().toDateString()} - ${
    createdAt.toDate().toTimeString().split(" ")?.[0]
  }`;
  const { userId } = useAuthUser();
  const isSameUser = userId === id;

  return (
    <div className="flex items-center gap-4 ">
      {anonymous ? (
        <div className="flex h-[40px] w-[40px] flex-row items-center justify-center rounded-full border p-1">
          <FaUserSecret size="20px" />
        </div>
      ) : (
        <div className="placeholder avatar">
          <div className="h-[40px] w-[40px] rounded-full bg-neutral-focus text-neutral-content">
            <span className="text-xs">{value?.name?.[0]}</span>
          </div>
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-bold ">
          {anonymous ? "Anonymous User" : value?.name}
        </span>
        <span className="text-xs">{dateData}</span>
      </div>
      {isSameUser && (
        <div className="dropdown-bottom dropdown-end dropdown ml-auto">
          <label
            onClick={(e) => e.stopPropagation()}
            tabIndex={0}
            className="flex cursor-pointer justify-center p-3"
          >
            <FaEllipsisV />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow-md"
          >
            <li>
              <label onClick={(e) => e.stopPropagation()} htmlFor={domId}>
                Edit
              </label>
            </li>
            <li>
              <label
                onClick={(e) => e.stopPropagation()}
                htmlFor={`${domId}-delete`}
              >
                Delete
              </label>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

const Post = ({
  doc,
  defaultShowComment,
}: {
  doc: DocumentSnapshot<Post>;
  defaultShowComment?: boolean;
}) => {
  const { activeFinalClosure, isClosureActive } =
    useRecoilValue(activeClosureAtom);
  const loggedInUser = useRecoilValue(LoggedInUserAtom);

  const msgRef: any = useRef();
  const data = doc.data();
  const postId = doc.id;
  const router = useRouter();
  const { userId } = useAuthUser();
  const user = useRecoilValue(LoggedInUserAtom);

  console.log("🚀 ~ file: Post.tsx:197 ~ user:", user);
  const domId = `modal-${postId}`;
  const [LastestComment] = useCol(
    "comments",
    {},

    where("postId", "==", postId),
    defaultShowComment ? limit(100) : limit(2)
  );
  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");
  const postedUserId = data?.user?.id || "";

  const [anonymous, setAnonymous] = useState(false);
  const [postedUser] = useDocData<User>("users/" + postedUserId || "");
  console.log("🚀 ~ file: Post.tsx:214 ~ postedUser:", postedUser);

  if (!data) return <></>;

  const isLiked = data?.likes && data?.likes[userId as string];
  const isDisliked = data?.dislikes && data?.dislikes[userId as string];
  const likeCount = data?.likes ? Object.keys(data?.likes).length : 0;

  const disLikeCount = data?.dislikes ? Object.keys(data?.dislikes).length : 0;

  const likePost = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const likesData = { ...data?.likes };
    const disLikesData = { ...data?.dislikes };

    //add like to the post

    if (isDisliked) {
      delete disLikesData[userId as string];
    }

    //remove link like in post
    if (isLiked) {
      delete likesData[userId as string];
    } else {
      likesData[userId as string] = true;
    }

    updateDoc(doc.ref, {
      likes: likesData,
      dislikes: disLikesData,
    });
  };

  const sendEmail = (anonymous: boolean) => {
    const name = user?.name;

    fetch("/api/email", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        name,
        email: postedUser?.email,
        isComment: true,
        anonymous,
      }),
      // body: JSON.stringify({ a: 1, b: 2 }),
    });
  };

  const unLikePost = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const likesData = { ...data?.likes };
    const disLikesData = { ...data?.dislikes }; //add like to the post

    //remove link like in post

    if (isLiked) {
      delete likesData[userId as string];
    }
    if (isDisliked) {
      delete disLikesData[userId as string];
    } else {
      disLikesData[userId as string] = true;
    }

    updateDoc(doc.ref, {
      likes: likesData,
      dislikes: disLikesData,
    });
  };
  const addComment = async (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const msg = `${message}`;
    setMessage("");
    if (message) {
      setData(`comments`, {
        userId: userId as string,
        postId,
        message: msg,
        isAnonymous: anonymous,
        createdAt: new Date(),
      });
      updateDoc(doc.ref, {
        commentCount: data.commentCount ? data.commentCount + 1 : 1,
      });
      sendEmail(anonymous);
    }
  };
  const tags = data.tags ? Object.entries(data.tags) : [];

  return (
    <>
      <div className="card w-full rounded-lg border border-grey-light">
        <div className="card-body p-4 sm:p-8">
          <div
            onClick={(e) => router.push("/posts/" + doc.id)}
            className="cursor-pointer"
          >
            <UserInfo
              postId={doc.id}
              domId={domId}
              id={postedUserId}
              createdAt={data.createdAt}
              anonymous={data.anonymous}
            />
            <p className="font-base mt-4 mb-3 text-base">{data.title}</p>
          </div>
          <div className="mb-2 flex flex-wrap gap-x-2 text-sm font-bold">
            {data.img && (
              <a
                target="__blank"
                href={data.img}
                className="flex max-w-[80px] cursor-pointer flex-row items-center space-x-2 rounded-lg bg-grey-light p-2"
              >
                <FaFileAlt size="20px" />
                <span>File</span>
              </a>
            )}
            {tags.map((tag, i) => {
              return (
                <button
                  key={i}
                  className="rounded-md bg-blue p-2 text-white"
                  onClick={() =>
                    router.push({
                      query: {
                        filter: tag[0],
                      },
                      pathname: "/",
                    })
                  }
                >
                  #{tag[1]}
                </button>
              );
            })}
          </div>
          <div
            className={`mb-4 flex flex-row flex-wrap items-center space-x-3 text-center [&>*]:cursor-pointer [&>*]:p-4`}
          >
            <button
              className={`btn-outline btn-primary btn px-6 ${
                isLiked && "btn-active"
              } `}
              onClick={likePost}
            >
              <div className="flex gap-2">
                <FaThumbsUp /> {likeCount}
              </div>
            </button>
            <button
              className={`btn-outline btn-primary  btn  ${
                isDisliked && "btn-active"
              } `}
              onClick={unLikePost}
            >
              <div className="flex gap-2">
                <FaThumbsDown /> {disLikeCount}
              </div>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (activeFinalClosure && isClosureActive) {
                  return setShowComment(true);
                }

                (
                  document.getElementById(
                    "notActiveFinalClosure" as string
                  ) as HTMLInputElement
                ).checked = true;
              }}
              className={`btn-outline btn-primary btn`}
            >
              <div className={`flex gap-2`}>
                <FaCommentAlt /> {data.commentCount}
              </div>
            </button>
          </div>
          <div className="mb-4 border-b border-b-grey-light"></div>
          <div className="flex flex-col space-y-5">
            {LastestComment?.docs.map((doc) => {
              return <Comment key={doc.id} doc={doc} />;
            })}
          </div>
          {isClosureActive &&
            activeFinalClosure &&
            (showComment || defaultShowComment) && (
              <div className="mt-4">
                <div className="col-span-2 flex gap-4">
                  <div className="placeholder avatar">
                    <div className="h-[40px] w-[40px] rounded-full bg-neutral-focus text-neutral-content">
                      <span className="text-xs">{loggedInUser?.name?.[0]}</span>
                    </div>
                  </div>
                  <textarea
                    className="textarea-bordered textarea w-full resize-none leading-5"
                    placeholder="type something to send"
                    ref={msgRef}
                    value={message}
                    rows={4}
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                    onKeyUp={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (e.key === "Enter") {
                        return addComment(e);
                      }
                    }}
                  ></textarea>

                  <button
                    onClick={addComment}
                    className="btn-primary btn-circle btn gap-2 text-white"
                  >
                    <FaRegPaperPlane size="18px" />
                  </button>
                </div>
                <div className="mt-1 flex">
                  <label
                    htmlFor={doc.id}
                    className="label ml-auto cursor-pointer justify-start gap-2"
                  >
                    <input
                      type="checkbox"
                      name="anonymous"
                      id={doc.id}
                      className="checkbox"
                      checked={anonymous}
                      onChange={(e) => {
                        setAnonymous(!anonymous);
                      }}
                    />
                    <span className="text-sm font-bold">
                      Post comment as anonymous
                    </span>
                  </label>
                </div>
              </div>
            )}
        </div>
      </div>
      <AddPostModal domId={domId} postId={doc.id} />
      <DeleteModal postId={doc.id} domId={`${domId}-delete`} />
    </>
  );
};

export default Post;
