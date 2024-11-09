import { QuerySnapshot } from "firebase/firestore";
import Post from "./Post";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  FaSlidersH,
  FaChevronLeft,
  FaChevronRight,
  FaSort,
} from "react-icons/fa";
import { useCol } from "@/fiebase/dbHooks";
import { useRouter } from "next/router";
import { useToggle } from "react-use";
import EmptyList from "../UI/EmptyList";
import { Loader } from "../UI/Loader";
import ReactPaginate from "react-paginate";

const PostList = ({
  posts,
  loading,
  total,
}: {
  posts?: QuerySnapshot<Post>;
  loading?: boolean;
  total?: number;
}) => {
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);
  const [categories] = useCol<Category>(`categories`);
  const router = useRouter();
  const { filter, sort } = router.query;
  // console.log("🚀 ~ file: PostList.tsx:23 ~ count:", count);
  const [on, toggle] = useToggle(false);

  const [sortOn, sortToggle] = useToggle(false);

  const currentPage = Number(router.query.page) || 1;
  const sliceIndex = (currentPage - 1) * 5;

  const sortByDate = (a: any, b: any) => {
    const aData = a.data();
    const bData = b.data();
    const sort = bData.createdAt - aData.createdAt;

    return sort;
  };
  const sortByLiked = (a: any, b: any) => {
    const aData = a.data();
    const bData = b.data();
    const sort =
      Object.keys(bData.likes || {}).length -
      Object.keys(aData.likes || {}).length;
    return sort;
  };
  const sortByView = (a: any, b: any) => {
    const aData = a.data();
    const bData = b.data();
    const sort =
      Object.keys(bData.views || {}).length -
      Object.keys(aData.views || {}).length;
    return sort;
  };
  const sortFuncs = {
    latest: sortByDate,
    "most liked": sortByLiked,
    "most viewd": sortByView,
  };

  const sortedPosts = posts?.docs
    .sort(sortFuncs[(sort || "latest") as keyof typeof sortFuncs])
    .filter((a) => {
      if (filter) return !!a.data().tags[filter as string];
      return true;
    });

  const slicedPost = sortedPosts?.slice(sliceIndex, 5 * currentPage);

  const filtered = categories?.docs.find((c) => c.id === filter);
  const setSort = (sort: string) => {
    sortToggle();
    router.push({
      query: {
        ...router.query,
        sort,
      },
    });
  };
  const setFilter = (id: string, name: string) => {
    toggle();
    router.push({
      query: {
        ...router.query,

        filter: id,
        filterName: name,
      },
    });
  };
  return (
    <div ref={parent} className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div
          className={`dropdown-end dropdown ${
            sortOn ? "dropdown-open" : "dropdown-close"
          } dropdown- z-40`}
        >
          {categories?.docs && (
            <div className="">
              <label
                tabIndex={0}
                onClick={sortToggle}
                className="btn-ghost btn flex cursor-pointer items-center justify-center gap-2 text-xl font-bold capitalize text-info"
              >
                <div className="flex flex-row items-center space-x-2 text-xl text-primary">
                  <FaSort size={20} /> <span>Sort by {sort || "Lastest"}</span>
                </div>
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box left-1 max-h-64 w-52 flex-nowrap overflow-auto bg-base-100 p-2 shadow"
              >
                <li
                  onClick={() => {
                    setSort("latest");
                  }}
                >
                  <a>by Latest</a>
                </li>
                <li
                  onClick={() => {
                    setSort("most liked");
                  }}
                >
                  <a>by Most Liked</a>
                </li>
                <li
                  onClick={() => {
                    setSort("most viewed");
                  }}
                >
                  <a>by Most Viewed</a>
                </li>

                {/* {categories?.docs.map((category) => (
                  <li
                    onClick={() => {
                      toggle();
                      router.push({
                        query: {
                          filter: category.id,
                          filterName: category.data().name,
                        },
                      });
                    }}
                    key={category.id}
                  >
                    <a>{category.data().name}</a>
                  </li>
                ))} */}
              </ul>
            </div>
          )}
        </div>
        <div
          className={`dropdown-end dropdown ${
            on ? "dropdown-open" : "dropdown-close"
          } dropdown- z-40`}
        >
          {categories?.docs && (
            <div className="">
              <label
                tabIndex={0}
                onClick={toggle}
                className="btn-ghost btn flex cursor-pointer items-center justify-center gap-2 text-xl font-bold capitalize text-info"
              >
                {filter ? (
                  <span className="text-xl text-primary">
                    #{filtered?.data().name}
                  </span>
                ) : (
                  <div className="flex flex-row items-center space-x-2 text-xl text-primary">
                    <FaSlidersH size={20} /> <span>Filter</span>
                  </div>
                )}
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box max-h-64 w-52 flex-nowrap overflow-auto bg-base-100 p-2 shadow"
              >
                <li
                  onClick={() => {
                    setFilter("", "");
                  }}
                >
                  <a>No Filter</a>
                </li>
                {categories?.docs.map((category) => (
                  <li
                    onClick={() => {
                      setFilter(category.id, category.data().name);
                    }}
                    key={category.id}
                  >
                    <a>{category.data().name}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <Loader isFullHeight={false} />
      ) : !!sortedPosts && sortedPosts?.length > 0 ? (
        <div className="flex flex-col justify-center gap-4">
          {slicedPost?.map((doc) => {
            return <Post key={doc.id} doc={doc} />;
          })}
          <ReactPaginate
            breakLabel="..."
            nextLabel={
              <button className="btn-outline btn-primary btn">
                <FaChevronRight />
              </button>
            }
            className="mx-auto my-4 flex space-x-2"
            activeLinkClassName="text-white rounded-lg btn-primary btn btn-active"
            pageLinkClassName="btn btn-outline btn-primary"
            onPageChange={(page) => {
              router.push({
                query: {
                  ...router.query,
                  page: page.selected + 1,
                },
              });
            }}
            forcePage={currentPage ? Number(currentPage) - 1 : 0}
            pageRangeDisplayed={5}
            pageCount={total ? total / 5 : 0}
            previousLabel={
              <button className="btn-outline btn-primary btn">
                <FaChevronLeft />
              </button>
            }
          />
        </div>
      ) : (
        <EmptyList emptyText="No ideas for now" />
      )}
    </div>
  );
};

export default PostList;
