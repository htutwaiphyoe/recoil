import Layout from "@/components/Layout";
import { db, storage } from "@/fiebase/db";
import {
  setData,
  useAuthUser,
  useCol,
  useDoc,
  useDocData,
  useGetCount,
} from "@/fiebase/dbHooks";
import styles from "@/styles/Home.module.css";
import { Inter } from "@next/font/google";
import { GrSend } from "react-icons/gr";
import {
  DocumentReference,
  DocumentSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
  doc as docRef,
  where,
  limit,
  orderBy,
  doc,
  CollectionReference,
  QuerySnapshot,
  startAt,
} from "firebase/firestore";
import Head from "next/head";
import React, { ReactEventHandler, SyntheticEvent } from "react";
import Post from "@/components/Post/Post";
import Form, { FormProps } from "@/components/Form";
import { ref, uploadBytes } from "firebase/storage";
import { UseFormStateProps } from "react-hook-form";
import AddPostModal from "@/components/Post/PostModal";
import PostList from "@/components/Post/PostList";
import Tabs from "@/components/Tabs";
import { AiFillHome } from "react-icons/ai";
import { FaLightbulb, FaCommentAlt, FaPlus } from "react-icons/fa";
import Comment from "@/components/Post/Comment";
import { useRouter } from "next/router";
import { Loader } from "@/components/UI/Loader";
import EmptyList from "@/components/UI/EmptyList";
import { useActiveClosure } from "@/hooks/logic";
import { useRecoilValue } from "recoil";
import { activeClosureAtom } from "@/state";
import { HomeHead } from "@/components/Meta/Meta";

const MypostList = ({ user }: { user: DocumentSnapshot<any> }) => {
  const [posts, loading, postError] = useCol<Post>(
    "posts",
    {},
    where("user", "==", user?.ref)
  );
  const router = useRouter();

  const { filter, filterName } = router.query;

  const countQuery = !!filter
    ? [
        where(`tags.${filter}`, "==", filterName),
        where("user", "==", user?.ref),
      ]
    : [where("user", "==", user?.ref)];

  const count = useGetCount("posts", ...countQuery);

  return <PostList total={count} loading={loading} posts={posts} />;
};

const Myposts = () => {
  const { user, loading, error, userId } = useAuthUser();
  const [value] = useDoc<{
    name: string;
    img: string;
  }>(("users/" + userId) as string);

  if (value) {
    return <MypostList user={value} />;
  }
  return <></>;
};

const HomeFeeds = () => {
  const router = useRouter();
  const { filter, filterName } = router.query;

  const query = !!filter
    ? [limit(5), where(`tags.${filter}`, "==", filterName)]
    : [limit(5)];

  const countQuery = !!filter
    ? [where(`tags.${filter}`, "==", filterName)]
    : [];
  const [value, loading, error] = useCol<Post>(
    "posts",
    {},
    orderBy("createdAt", "desc")
    // startAt(0),
  );

  const count = useGetCount("posts", ...countQuery);

  return <PostList total={count} loading={loading} posts={value} />;
};

const Comments = () => {
  const [value, loading, error] = useCol<any>(
    "comments",
    {},
    // where("name", "==", "pkk")
    orderBy("createdAt", "desc")
  );
  const router = useRouter();

  if (loading) {
    return <Loader isFullHeight={false} />;
  }

  return (
    <div className="flex flex-col space-y-4">
      {value && value?.docs.length > 0 ? (
        value?.docs.map((v) => {
          return (
            <a
              onClick={() => {
                router.push("/posts/" + v.data().postId);
              }}
              key={v.id}
              className="cursor-pointer"
            >
              <Comment doc={v} />
            </a>
          );
        })
      ) : (
        <EmptyList emptyText="No comment for now." />
      )}
    </div>
  );
};

const tabs: Array<Tab> = [
  {
    key: "home",
    name: "Home",
    icon: <AiFillHome size={16} />,
    Render: HomeFeeds,
  },
  {
    key: "ideas",
    name: "My Ideas",
    Render: Myposts,
    icon: <FaLightbulb size={16} />,
  },
  {
    key: "comments",
    name: "Comments",
    Render: Comments,
    icon: <FaCommentAlt size={16} />,
  },
];

export default function Home() {
  const { activeClosure, isClosureActive } = useRecoilValue(activeClosureAtom);
  const { userId } = useAuthUser();
  const [user] = useDoc<User>("users/" + userId);
  const userData = user?.data();
  const agreedTerms = !!userData?.agreedTerms;

  const agreeTerms = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user?.ref) {
      try {
        updateDoc(user?.ref, {
          agreedTerms: true,
        });
        (
          document.getElementById("notAgreeTerms" as string) as HTMLInputElement
        ).checked = false;
      } catch (error) {}
    }
  };

  return (
    <>
      <HomeHead />
      <Layout>
        <section className="px-0 sm:px-5">
          <div className="mb-4 flex justify-between">
            <h4 className="mb-6 text-3xl font-bold">Feeds </h4>
            {isClosureActive && activeClosure && agreedTerms ? (
              <label
                htmlFor="addPostModal"
                className="btn-primary btn gap-2 text-white"
              >
                <FaPlus /> New idea
              </label>
            ) : !isClosureActive || !activeClosure ? (
              <label
                htmlFor="noActiveClosure"
                className="btn-primary btn gap-2 text-white"
              >
                <FaPlus /> New idea
              </label>
            ) : (
              <label
                htmlFor="notAgreeTerms"
                className="btn-primary btn gap-2 text-white"
              >
                <FaPlus /> New idea
              </label>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <AddPostModal domId="addPostModal" />
            <Tabs tabs={tabs} />
          </div>

          <input type="checkbox" id="notAgreeTerms" className="modal-toggle" />
          <label htmlFor="notAgreeTerms" className="modal cursor-pointer">
            <label className="modal-box relative" htmlFor="">
              <h3 className="text-lg font-bold">Terms And Conditions</h3>

              <p className="py-4">
                Thank you for considering using a school ideas sharing app! Here
                are some general terms and conditions that could apply to such
                an app:
                <ul className="p-4">
                  <li>
                    User eligibility: Users of the app must be current students,
                    staff members, or faculty members of the school or schools
                    that the app is designed for. Users must provide valid
                    credentials to verify their affiliation with the school.
                  </li>
                  <li>
                    User-generated content: Users are solely responsible for the
                    content they post on the app. The app&apos;s administrators
                    will monitor content to ensure compliance with school
                    policies and applicable laws. However, the app&apos;s
                    administrators cannot be held responsible for any content
                    posted by users.
                  </li>
                  <li>
                    Prohibited content: Users may not post any content that is
                    illegal, harmful, defamatory, or discriminatory. This
                    includes content that is pornographic, violent, or promotes
                    hate speech. The app&apos;s administrators reserve the right
                    to remove any content that violates these terms and
                    conditions.
                  </li>
                  <li>
                    Intellectual property: Users must only post content that
                    they own or have the necessary rights to share. Users must
                    not post any content that infringes on someone else&apos;s
                    intellectual property rights.
                  </li>
                  <li>
                    Appropriate use: Users must use the app for its intended
                    purpose, which is to share ideas and resources related to
                    the school community. Users must not use the app for
                    commercial purposes or to promote other products or
                    services.
                  </li>
                  <li>
                    Privacy: The app&apos;s administrators will collect and use
                    personal information from users to provide and improve the
                    app&apos;s services. However, the app&apos;s administrators
                    will not share personal information with third parties
                    without user consent. Users can request access to their
                    personal information and request that it be corrected or
                    deleted.
                  </li>
                  <li>
                    Limitation of liability: The app&apos;s administrators
                    cannot be held liable for any damages arising from the use
                    of the app. Users agree to indemnify and hold harmless the
                    app&apos;s administrators from any claims, damages, or
                    expenses that arise from the user&apos;s use of the app.
                  </li>
                  <li>
                    Termination: The app&apos;s administrators reserve the right
                    to terminate a user&apos;s access to the app at any time,
                    without notice or reason.
                  </li>
                  <li>
                    Changes to terms and conditions: The app&apos;s
                    administrators reserve the right to modify these terms and
                    conditions at any time. Users will be notified of any
                    changes to the terms and conditions, and continued use of
                    the app after the changes take effect constitutes acceptance
                    of the new terms.
                  </li>
                  <li>
                    By using the school ideas sharing app, users agree to abide
                    by these terms and conditions.
                  </li>
                </ul>
              </p>

              <div className="modal-action">
                <label
                  onClick={agreeTerms}
                  htmlFor="notAgreeTerms"
                  className="btn-primary btn"
                >
                  Agree
                </label>
              </div>
            </label>
          </label>
        </section>
      </Layout>
    </>
  );
}
