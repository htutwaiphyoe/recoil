import Form from "../Form";
import { setData, useDoc } from "@/fiebase/dbHooks";
import { UseFormReturn } from "react-hook-form";
import { updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

export default function CategoryModal({
  categoryId,
  isOpen,
  setIsOpen,
}: {
  categoryId?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  return categoryId ? (
    <UpdateCategoryModalContent
      {...{ categoryId, modalHandlers: { isOpen, setIsOpen } }}
    />
  ) : (
    <CreateCategoryModalContent {...{ modalHandlers: { isOpen, setIsOpen } }} />
  );
}

function CreateCategoryModalContent({
  modalHandlers,
}: {
  modalHandlers: { isOpen: boolean; setIsOpen: (open: boolean) => void };
}) {
  const createCategory = async (val: Category, form: UseFormReturn) => {
    if (!val.name.trim()) return;
    await setData("categories", val)
      .then(() => {
        modalHandlers.setIsOpen(false);
        form.reset({ name: "" });
        toast.success("Category added.");
      })
      .catch(() => toast.error("Something went wrong"));
  };

  return (
    <CategoryModalContent {...{ onSubmit: createCategory, modalHandlers }} />
  );
}

function UpdateCategoryModalContent({
  categoryId,
  modalHandlers,
}: {
  categoryId: string;
  modalHandlers: { isOpen: boolean; setIsOpen: (open: boolean) => void };
}) {
  const [data] = useDoc<Category>("categories/" + categoryId);
  if (!data) return <></>;

  const category = data?.data();
  const categoryDocRef = data?.ref;

  const updateCategory = async (val: Category) => {
    if (!val.name) return;
    await updateDoc(categoryDocRef, val)
      .then(() => {
        modalHandlers.setIsOpen(false);
        toast.success("Category saved.");
      })
      .catch(() => toast.error("Something went wrong"));
  };

  return (
    <CategoryModalContent
      {...{
        categoryId,
        onSubmit: updateCategory,
        defaults: category,
        modalHandlers,
      }}
    />
  );
}

function CategoryModalContent({
  onSubmit,
  categoryId,
  defaults = { name: "" },
  modalHandlers,
}: {
  categoryId?: string;
  onSubmit: any;
  defaults?: Category;
  modalHandlers: { isOpen: boolean; setIsOpen: (open: boolean) => void };
}) {
  return (
    <>
      <input
        id="category-modal"
        type="checkbox"
        className="modal-toggle"
        checked={modalHandlers.isOpen}
        onChange={(res) => modalHandlers.setIsOpen(res.target.checked)}
      />
      <label htmlFor="category-modal" className="modal cursor-pointer">
        <label className="modal-box relative flex flex-col gap-4">
          <h3 className="text-3xl font-bold">
            {categoryId ? "Edit" : "Create New"} Category
          </h3>
          <Form
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
            defaults={defaults}
          >
            {(props) => {
              return (
                <>
                  <div className="form-control mb-1 w-full">
                    <label className="mb-2 text-sm" htmlFor="category">
                      Category
                    </label>
                    <input
                      type="text"
                      id="category"
                      placeholder="Enter category"
                      className="input-bordered input w-full max-w-md border-grey-input py-5 text-base"
                      required
                      value={props.values?.name}
                      {...props.register("name")}
                    />
                  </div>
                  <div className="flex flex-row justify-end">
                    <button
                      type="submit"
                      className="btn-primary btn ml-auto text-white"
                      disabled={props.formState.isSubmitting}
                    >
                      {categoryId ? "Save" : "Add"}
                    </button>
                  </div>
                </>
              );
            }}
          </Form>
        </label>
      </label>
    </>
  );
}
