import CategoryModal from "@/components/Category/CategoryModal";
import Layout from "@/components/Layout";
import { QueryDocumentSnapshot, where } from "firebase/firestore";
import { deleteData, useCol } from "@/fiebase/dbHooks";
import { useState } from "react";
import ConfirmModal from "@/components/UI/ConfirmModal";
import { toast } from "react-hot-toast";
import { Loader } from "@/components/UI/Loader";
import { FaPlus, FaPen, FaTrash } from "react-icons/fa";
import EmptyList from "@/components/UI/EmptyList";
import { CategoriesHead } from "@/components/Meta/Meta";
import { useRecoilValue } from "recoil";
import { LoggedInUserAtom } from "@/state";
import { useRouter } from "next/router";
import { roles } from "@/utils/data";

const categoriesRouteRoles = [roles.qaManager];

export default function Categories() {
  const [value, loading] = useCol<Category>("categories", {});
  const categories: Array<QueryDocumentSnapshot> = value?.docs || [];

  const loggedInUser = useRecoilValue(LoggedInUserAtom);
  const router = useRouter();

  const [categoryId, setCategoryId] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletedCategoryId, setDeletedCategoryId] = useState("");

  const [posts] = useCol<Post>("posts");

  if (loggedInUser.role && !categoriesRouteRoles.includes(loggedInUser.role)) {
    router.replace("/");
    return <></>;
  }

  const handleEditModalOpening = (id: string) => {
    setCategoryId(id);
    setIsFormModalOpen(true);
  };

  const handleDeleteModalOpening = (id: string) => {
    setDeletedCategoryId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    try {
      const tags = posts?.docs.map((post) => post.data().tags);
      const isPostExist = tags?.find((tag) => tag[deletedCategoryId]);
      if (isPostExist) {
        setIsDeleteModalOpen(false);
        setDeletedCategoryId("");
        toast.error(
          "This category cannot be deleted since there is a post related with."
        );
      } else {
        await deleteData(`categories/${deletedCategoryId}`);
        setIsDeleteModalOpen(false);
        setDeletedCategoryId("");
        toast.success("Category deleted.");
      }
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };

  return (
    <Layout>
      <CategoriesHead />
      {loading ? (
        <Loader isFullHeight={false} />
      ) : (
        <section className="px-5">
          <div className="mb-4">
            <div className="mb-6 flex flex-col space-y-5 px-3 xs:flex-row xs:items-center xs:justify-between xs:space-y-0">
              <h1 className="text-4xl font-bold">Categories</h1>
              <button
                onClick={() => handleEditModalOpening("")}
                className="btn-primary btn gap-2 text-white"
              >
                <FaPlus /> New category
              </button>
            </div>
            <CategoryModal
              isOpen={isFormModalOpen}
              categoryId={categoryId}
              setIsOpen={setIsFormModalOpen}
            />
            <ConfirmModal
              modalHandlers={{
                isOpen: isDeleteModalOpen,
                setIsOpen: setIsDeleteModalOpen,
              }}
              confirmHandler={handleDeleteCategory}
              message={"Are you sure you want to delete this category?"}
            />
          </div>
          <CategoryList
            categories={categories}
            handleEditModalOpening={handleEditModalOpening}
            handleDeleteModalOpening={handleDeleteModalOpening}
          />
        </section>
      )}
    </Layout>
  );
}

function CategoryList({
  categories = [],
  handleEditModalOpening,
  handleDeleteModalOpening,
}: {
  categories: Array<QueryDocumentSnapshot>;
  handleEditModalOpening: (id: string) => void;
  handleDeleteModalOpening: (id: string) => void;
}) {
  return (
    <>
      {categories && categories.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category: QueryDocumentSnapshot, index) => (
                <Category
                  number={index + 1}
                  key={category.id}
                  category={category}
                  handleEditModalOpening={handleEditModalOpening}
                  handleDeleteModalOpening={handleDeleteModalOpening}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyList emptyText="No category for now." />
      )}
    </>
  );
}

function Category({
  category: categoryDoc,
  number,
  handleEditModalOpening,
  handleDeleteModalOpening,
}: {
  category: QueryDocumentSnapshot;
  number: number;
  handleEditModalOpening: (id: string) => void;
  handleDeleteModalOpening: (id: string) => void;
}) {
  const category: Category = categoryDoc.data() as Category;

  return (
    <tr>
      <td>{number}</td>
      <td>{category.name}</td>
      <td>
        <button
          className="btn-outline btn-primary btn-square btn-sm btn"
          onClick={() => handleEditModalOpening(categoryDoc.id)}
        >
          <FaPen />
        </button>
        <button
          className="btn-outline btn-error btn-square btn-sm btn ml-2"
          onClick={() => handleDeleteModalOpening(categoryDoc.id)}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}
