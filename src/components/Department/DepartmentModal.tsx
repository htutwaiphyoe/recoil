import Form from "../Form";
import { setData, useDoc } from "@/fiebase/dbHooks";
import { UseFormReturn } from "react-hook-form";
import { updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

export default function DepartmentModal({
  departmentId,
  isOpen,
  setIsOpen,
}: {
  departmentId?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  if (departmentId)
    return (
      <UpdateDepartmentModalContent
        {...{ departmentId, modalHandlers: { isOpen, setIsOpen } }}
      />
    );
  return (
    <CreateDepartmentModalContent
      {...{ modalHandlers: { isOpen, setIsOpen } }}
    />
  );
}

function CreateDepartmentModalContent({
  modalHandlers,
}: {
  modalHandlers: { isOpen: boolean; setIsOpen: (open: boolean) => void };
}) {
  const resetForm = (form: UseFormReturn) => {
    form.reset({ name: "" });
  };

  const createDepartment = async (val: any, form: UseFormReturn) => {
    if (!val.name) return;
    const data: Department = {
      name: val.name,
    };
    try {
      await setData("departments", data);
      modalHandlers.setIsOpen(false);
      resetForm(form);
      toast.success("Department added.");
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  return (
    <DepartmentModalContent
      {...{ onSubmit: createDepartment, modalHandlers }}
    />
  );
}

function UpdateDepartmentModalContent({
  departmentId,
  modalHandlers,
}: {
  departmentId: string;
  modalHandlers: { isOpen: boolean; setIsOpen: (open: boolean) => void };
}) {
  // data - need to handle errors and stuff here prob
  const [data] = useDoc<Department>("departments/" + departmentId);
  if (!data) return <></>;
  const department = data?.data();
  const departmentDocRef = data?.ref;

  const updateDepartment = async (val: any, form: UseFormReturn) => {
    if (!val.name) return;
    const data: Department = {
      name: val.name,
    };

    try {
      await updateDoc(departmentDocRef, data);
      modalHandlers.setIsOpen(false);
      toast.success("Department saved.");
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  return (
    <DepartmentModalContent
      {...{
        departmentId,
        onSubmit: updateDepartment,
        defaults: department,
        modalHandlers,
      }}
    />
  );
}

function DepartmentModalContent({
  onSubmit,
  departmentId,
  defaults = {},
  modalHandlers = {},
}: {
  departmentId?: string;
  onSubmit: any;
  defaults?: any;
  modalHandlers?: any;
}) {
  return (
    <>
      <input
        id="department-modal"
        type="checkbox"
        className="modal-toggle"
        checked={modalHandlers.isOpen}
        onChange={(res) => {
          modalHandlers.setIsOpen(res.target.checked);
        }}
      />
      <label htmlFor="department-modal" className="modal cursor-pointer">
        <label className="modal-box relative flex flex-col gap-4">
          <h3 className="text-3xl font-bold">
            {departmentId ? "Edit" : "Create New"} Department
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
                    <label className="mb-2 text-sm" htmlFor="department">
                      Department
                    </label>
                    <input
                      type="text"
                      id="department"
                      placeholder="Enter department"
                      className="input-bordered input w-full max-w-md border-grey-input py-5 text-base"
                      name="name"
                      required
                      value={props?.values?.name || ""}
                      onChange={props.onChange}
                    />
                  </div>
                  <div className="flex flex-row justify-end">
                    <button
                      type="submit"
                      className="btn-primary btn ml-auto text-white"
                      disabled={props.formState.isSubmitting}
                    >
                      {departmentId ? "Save" : "Add"}
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
