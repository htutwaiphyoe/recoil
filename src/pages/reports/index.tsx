import Layout from "@/components/Layout";
import { ReportsHead } from "@/components/Meta/Meta";
import * as R from "ramda";
import { db } from "../../fiebase/db";
import { useRouter } from "next/router";
import { ref, getStorage, listAll, getDownloadURL } from "firebase/storage";
import {
  QueryDocumentSnapshot,
  doc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import {
  Colors,
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { AiFillLike } from "react-icons/ai";
import { FaCommentAlt, FaLightbulb, FaFileExport } from "react-icons/fa";
import JSZip from "jszip";
import { downloadZip } from "@/utils/helper";
import { useRecoilValue } from "recoil";
import { activeClosureAtom, LoggedInUserAtom } from "@/state";
import { roles } from "@/utils/data";

ChartJS.register(
  DoughnutController,
  ArcElement,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  LinearScale,
  Colors
);

const reportsRouteRoles = [roles.admin, roles.qaManager, roles.qaCoordinator];

export default function Reports() {
  const router = useRouter();
  const loggedInUser = useRecoilValue(LoggedInUserAtom) || {};
  const departmentId =
    loggedInUser.role === "QA Coordinator"
      ? loggedInUser.department
      : undefined;

  const populateDepartmentsInPost = useCallback(
    async (post: any): Promise<Post> => {
      if (post.department) {
        const docSnap = await getDoc(doc(db, "departments", post.department));
        post.departmentName = docSnap?.data()?.name;
      }
      return post as Post;
    },
    []
  );

  const [posts, setPosts] = useState<Array<any>>([]);
  const [categories, setCategories] = useState<Array<any>>([]);
  const [comments, setComments] = useState<Array<any>>([]);

  useEffect(() => {
    const convertToPOJO = (snapshot: QueryDocumentSnapshot): any => ({
      ...snapshot.data(),
      id: snapshot.id,
    });

    const filterPostsByDepartment = R.curry(
      (departmentId: string, posts: Array<Post>) => {
        return departmentId
          ? R.filter(R.propEq<string>("department", departmentId))(posts)
          : posts;
      }
    );

    const getAllResources = (collectionName: string) =>
      getDocs(collection(db, collectionName))
        .then(R.prop("docs"))
        .then(R.defaultTo([]))
        .then(R.map(convertToPOJO));

    Promise.all([
      getAllResources("posts"),
      getAllResources("categories"),
      getAllResources("comments"),
    ]).then(
      R.juxt([
        R.compose(
          R.compose(
            R.andThen(
              R.compose(setPosts, filterPostsByDepartment(departmentId))
            ),
            Promise.all.bind(Promise),
            R.map(populateDepartmentsInPost)
          ),
          R.head
        ),
        R.compose(setCategories, R.prop(1)),
        R.compose(setComments, R.last),
      ])
    );
  }, [populateDepartmentsInPost, departmentId]);

  if (loggedInUser.role && !reportsRouteRoles.includes(loggedInUser.role)) {
    router.replace("/");
    return <></>;
  }

  return (
    <Layout>
      <ReportsHead />
      <section className="px-2 md:px-5">
        <div className="mb-5 flex flex-row flex-wrap items-center justify-between space-x-2 space-y-2">
          <h4 className="text-4xl font-bold">Reports</h4>
          {loggedInUser.role === "QA Manager" ? (
            <ExportData posts={posts} />
          ) : (
            <></>
          )}
        </div>
        <Exceptions
          comments={comments}
          posts={posts}
          departmentId={departmentId}
        />
        <TopPosts posts={posts} />
        {departmentId ? <></> : <DepartmentDoughnutChart posts={posts} />}
        <CategoryBarChart posts={posts} categories={categories} />
      </section>
    </Layout>
  );
}

function ExportData({ posts }: { posts: Array<Post> }) {
  // State
  const { activeFinalClosure } = useRecoilValue(activeClosureAtom);

  const getFileBlobFromUrl = (url: string) => {
    return fetch(url).then((response) => {
      if (response.status === 200) return response.blob();
      throw new Error(response.statusText);
    });
  };

  const addToZip = R.curry((zip: any, url: string, blob: Blob) => {
    const name = url ? url.substring(url.lastIndexOf("/")) : "ideas.json";
    zip.file(name, blob, { binary: true });
  });

  const exportData = async () => {
    // Init Zip
    const zip = new JSZip();
    const appendFileToZip = addToZip(zip);

    // Add ideas data as json file to zip
    R.compose(appendFileToZip(""), JSON.stringify)(posts);

    // Add attachments to zip
    const listRef = ref(getStorage(), "posts");
    const responseItems = await listAll(listRef).then(R.prop("items"));
    const response = responseItems.map(async (ref) => {
      const url = await getDownloadURL(ref).catch((err) => {
        throw new Error("Error fetching file : " + err.message);
      });
      return await R.pipe(
        getFileBlobFromUrl,
        R.andThen(appendFileToZip(url))
      )(url);
    });
    await Promise.all(response);
    await zip.generateAsync({ type: "blob" }).then(downloadZip);
  };

  return (
    <label
      className="btn-primary btn"
      {...(activeFinalClosure
        ? { htmlFor: "isBeforeFinalClosure" }
        : { onClick: exportData })}
    >
      <span className="text-md mr-2">Export</span>
      <FaFileExport />
    </label>
  );
}

function DepartmentDoughnutChart({ posts }: { posts: Array<Post> }) {
  const [data, setData] = useState<Array<number>>([]);
  const [label, setLabel] = useState<Array<string>>([]);

  useEffect(() => {
    const getDepartment = (post: Post): string =>
      R.prop("departmentName")(post) || "No Department";
    const countByDepartment = R.countBy(getDepartment);
    R.pipe(
      countByDepartment,
      R.applySpec({ data: Object.values, label: Object.keys }),
      R.evolve({ data: setData, label: setLabel })
    )(posts);
  }, [posts]);

  return (
    <div className="mb-6 rounded-lg border border-grey-light p-5">
      {data && data.length > 0 ? (
        <div className="mx-auto xs:w-1/2">
          <Doughnut
            className="!h-[400px] !w-full"
            data={{
              labels: label,
              datasets: [
                {
                  label: "# of ideas",
                  data: data,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                },
                title: {
                  display: true,
                  position: "top",
                  color: "#010101",
                  text: "Ideas per department",
                  font: {
                    size: 20,
                  },
                  padding: {
                    bottom: 20,
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

function CategoryBarChart({
  posts,
  categories,
}: {
  posts: Array<Post>;
  categories: Array<Category>;
}) {
  const [data, setData] = useState<Array<number>>([]);
  const [label, setLabel] = useState<Array<string>>([]);

  const groupPostsByCategories = ({
    posts,
    categories,
  }: {
    posts: Array<Post>;
    categories: Array<Category>;
  }): Array<{ name: string; count: number }> =>
    categories.map(({ id = "", name }) => {
      const count = R.count(R.hasPath(["tags", id]))(posts);
      return { name, count };
    });

  useEffect(() => {
    const perCategoryCounts = groupPostsByCategories({
      categories,
      posts,
    });
    setData(R.map(R.prop("count"))(perCategoryCounts));
    setLabel(R.map(R.prop("name"))(perCategoryCounts));
  }, [categories, posts]);

  return (
    <div className="rounded-lg border border-grey-light p-5">
      <Bar
        width="100%"
        height="400px"
        data={{
          labels: label,
          datasets: [
            {
              label: "# of Posts",
              data: data,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
            },
            title: {
              display: true,
              color: "#010101",
              position: "top",
              text: "Ideas per category",
              font: {
                size: 20,
              },
              padding: {
                bottom: 20,
              },
            },
          },
        }}
      />
    </div>
  );
}

function TopPosts({ posts }: { posts: Array<Post> }) {
  const [mostLikedPosts, setMostLikedPosts] = useState<Array<Post>>([]);
  const [mostCommentedPosts, setMostCommentedPosts] = useState<Array<Post>>([]);
  const router = useRouter();

  const countPostLikes = (post: Post): number =>
    Object.keys(post.likes || {}).length;

  useEffect(() => {
    R.compose(
      R.converge(
        R.curry((topLiked: Array<Post>, topCommented: Array<Post>) => {
          setMostLikedPosts(topLiked);
          setMostCommentedPosts(topCommented);
        }),
        [
          R.pipe(R.sort(R.descend(countPostLikes)), R.take(3)),
          R.pipe(R.sort(R.descend(R.prop<number>("commentCount"))), R.take(3)),
        ]
      ),
      R.identity
    )(posts);
  }, [posts]);

  return (
    <div className="mb-6 flex flex-col gap-6 md:flex-row">
      <div className="card w-full rounded-lg border border-grey-light">
        <div className="card-body p-2 sm:p-4">
          <h2 className="text-xl font-bold">Top liked ideas</h2>
          {mostLikedPosts ? (
            mostLikedPosts.map((post, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push("/posts/" + post.id);
                }}
                className="base-200 btn-ghost btn flex items-center justify-between space-x-5 normal-case"
              >
                <div className="max-w-[150px] truncate">{post.title}</div>
                <div className="flex flex-row space-x-2">
                  <AiFillLike />
                  <p>{Object.keys(post.likes || {}).length}</p>
                </div>
              </button>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="card w-full rounded-lg border border-grey-light">
        <div className="card-body p-2 sm:p-4">
          <h2 className="text-xl font-bold">Top commented ideas</h2>
          {mostCommentedPosts ? (
            mostCommentedPosts.map((post, idx) => (
              <button
                key={idx}
                className="btn-ghost btn flex justify-between normal-case"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push("/posts/" + post.id);
                }}
              >
                <div className="max-w-[150px] truncate">{post.title}</div>
                <div className="flex flex-row space-x-2">
                  <FaCommentAlt />
                  <p>{post.commentCount || 0}</p>
                </div>
              </button>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

function Exceptions({
  posts,
  comments,
  departmentId,
}: {
  posts: Array<any>;
  comments: Array<any>;
  departmentId?: string;
}) {
  const [noCommentPostCount, setNoCommentPostCount] = useState<number>(0);
  const [anonymousIdeaCount, setAnonymousIdeaCount] = useState<number>(0);
  const [anonymousCommentCount, setAnonymousCommentCount] = useState<number>(0);

  useEffect(() => {
    // Count Comments
    const countComments = R.compose(
      setAnonymousCommentCount,
      R.count(R.propEq("isAnonymous", true))
    );

    // Count Ideas
    const countIdeas = R.compose(
      R.converge(
        R.curry((commentCount, anonymousIdeas) => {
          setNoCommentPostCount(commentCount);
          setAnonymousIdeaCount(anonymousIdeas);
        }),
        [
          R.count(R.propEq("commentCount", 0)),
          R.count(R.propEq("anonymous", true)),
        ]
      )
    );

    if (departmentId) {
      countIdeas(posts);
      const filteredPostIds: Array<string> = R.pluck<string>("id")(posts);
      // filter anonymous comments posted under posts of this department
      const filteredComments = comments.filter((comment) =>
        filteredPostIds.includes(comment.postId)
      );
      countComments(filteredComments);
    } else {
      countIdeas(posts);
      countComments(comments);
    }
  }, [posts, comments, departmentId]);

  return (
    <div className="mb-6 flex flex-col gap-6 md:flex-row">
      <div className="card w-full rounded-lg border border-grey-light">
        <div className="card-body p-2 text-center sm:p-4">
          <h2 className="text-xl font-bold">Ideas without Comment</h2>
          <div className="flex flex-row items-center justify-center space-x-2">
            <FaLightbulb />
            <span className="text-xl">{noCommentPostCount}</span>
          </div>
        </div>
      </div>
      <div className="card w-full rounded-lg border border-grey-light">
        <div className="card-body p-2 text-center sm:p-4">
          <h2 className="text-xl font-bold">Anonymous ideas</h2>
          <div className="flex flex-row items-center justify-center space-x-2">
            <FaLightbulb />
            <span className="text-xl">{anonymousIdeaCount}</span>
          </div>
        </div>
      </div>
      <div className="card w-full rounded-lg border border-grey-light">
        <div className="card-body p-2 text-center sm:p-4">
          <h2 className="text-xl font-bold">Anonymous Comments</h2>
          <div className="flex flex-row items-center justify-center space-x-2">
            <FaCommentAlt />
            <span className="text-xl">{anonymousCommentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
