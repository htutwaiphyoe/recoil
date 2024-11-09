import Form from "@/components/Form";
import { userSchema, editUserSchema } from "@/utils/schema";
import {
  useCol,
  signUp,
  setData,
  sendResetPasswordEmail,
} from "@/fiebase/dbHooks";
import { roles } from "@/utils/data";
import toast from "react-hot-toast";
import { QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

const initialAccountValues: Account = {
  name: "",
  email: "",
  password: "",
  department: "",
  role: "",
  isActive: true,
};

const UsersModal = ({
  loggedInUser,
  selectedUser,
  users,
  isOpen,
  setIsOpen,
}: {
  loggedInUser: LoggedInUser;
  selectedUser: QueryDocumentSnapshot | null;
  users: Array<QueryDocumentSnapshot>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [departments] = useCol<Department>("departments");
  const [loading, setLoading] = useState(false);

  return (
    <>
      <input
        type="checkbox"
        className="modal-toggle"
        id="user-modal"
        checked={isOpen}
        onChange={(res) => setIsOpen(res.target.checked)}
      />
      <label htmlFor="user-modal" className="modal cursor-pointer">
        <label className="modal-box relative flex flex-col gap-4" htmlFor="">
          <h3 className="text-3xl font-bold">
            {selectedUser ? "Edit user" : "Create new user"}
          </h3>
          <Form
            schema={selectedUser ? editUserSchema : userSchema}
            onSubmit={async (values: Account, form: UseFormReturn) => {
              try {
                setLoading(true);
                const uniqueRoles = [roles.admin, roles.qaManager];

                const isRoleExist = users
                  .filter((user) =>
                    selectedUser ? selectedUser.id !== user.id : user.id
                  )
                  .find((user) => {
                    if (
                      values.role === user.data().role &&
                      uniqueRoles.includes(values.role)
                    ) {
                      toast.error(
                        `The account with ${values.role} role is already existed.`
                      );
                      return user.data();
                    }
                    if (
                      values.role === roles.qaCoordinator &&
                      values.role === user.data().role &&
                      values.department === user.data().department
                    ) {
                      const department = departments?.docs.find(
                        (department) => department.id === values.department
                      );
                      toast.error(
                        `The account with ${values.role} role of ${
                          department?.data().name
                        } department is already existed.`
                      );
                      return user.data();
                    }
                    return null;
                  });

                if (!isRoleExist && !selectedUser) {
                  const result = await signUp(values.email, values.password);
                  await setData(
                    "users",
                    {
                      name: values.name,
                      email: values.email,
                      department: values.department,
                      role: values.role,
                      isActive: true,
                    },
                    result.user.uid
                  );
                  setIsOpen(false);
                  toast.success("Account created.");
                  form.reset();
                }

                if (!isRoleExist && selectedUser) {
                  await updateDoc(selectedUser?.ref, {
                    name: values.name,
                    email: values.email,
                    department: values.department,
                    role: values.role,
                    isActive: values.isActive,
                  });
                  setIsOpen(false);
                  form.reset();
                  toast.success("Account saved.");
                }
              } catch (error: any) {
                toast.error(error?.message || "Something went wrong!");
              } finally {
                setLoading(false);
              }
            }}
            defaults={
              selectedUser
                ? { ...selectedUser.data() }
                : { ...initialAccountValues }
            }
            className="flex flex-col gap-4"
          >
            {(props) => {
              return (
                <>
                  <div className="form-control mb-1 w-full">
                    <label className="mb-2 text-sm" htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter name"
                      className="input-bordered input w-full border-grey-input py-5 text-base"
                      {...props.register("name")}
                    />
                  </div>
                  <div className="form-control mb-1 w-full">
                    <label className="mb-2 text-sm" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter email"
                      className="input-bordered input w-full border-grey-input py-5 text-base"
                      {...props.register("email")}
                      disabled={!!selectedUser}
                    />
                  </div>
                  <div className="form-control mb-1 w-full">
                    <label className="mb-2 text-sm" htmlFor="password">
                      Password
                    </label>
                    {!!selectedUser ? (
                      <button
                        type="button"
                        className="btn-primary btn-link w-[230px] text-left"
                        onClick={() => {
                          try {
                            sendResetPasswordEmail(selectedUser.data().email);
                            toast.success(
                              `Reset password email is sent to this ${
                                selectedUser.data().email
                              } email.`
                            );
                          } catch (e) {
                            toast.error("Something went wrong!");
                          }
                        }}
                      >
                        Send email to reset password
                      </button>
                    ) : (
                      <>
                        <input
                          type="password"
                          id="password"
                          placeholder="Enter password"
                          className="input-bordered input w-full border-grey-input py-5 text-base"
                          {...props.register("password")}
                          disabled={!!selectedUser}
                        />
                        <p className="mt-1 text-xs text-grey-input">
                          Password must be at least 8 characters
                        </p>
                      </>
                    )}
                  </div>
                  <div className="form-control mb-1 w-full">
                    <label className="mb-2 text-sm" htmlFor="department">
                      Department
                    </label>
                    <select
                      className="select-bordered select w-full"
                      id="department"
                      {...props.register("department")}
                    >
                      {departments?.docs
                        .filter(
                          (department) =>
                            loggedInUser.role === roles.admin ||
                            (loggedInUser.role === roles.qaCoordinator &&
                              loggedInUser.department === department.id)
                        )
                        .map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.data().name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="form-control mb-1 w-full">
                    <label className="mb-2 text-sm" htmlFor="role">
                      Role
                    </label>
                    <select
                      className="select-bordered select w-full"
                      id="role"
                      {...props.register("role")}
                      disabled={
                        !!selectedUser &&
                        selectedUser.data().role === roles.admin
                      }
                    >
                      {Object.values(roles).map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex">
                    <button
                      type="submit"
                      className="btn-primary btn ml-auto text-white"
                      disabled={
                        loading ||
                        props.formState.isSubmitting ||
                        !props.formState.isDirty ||
                        !props.formState.isValid
                      }
                    >
                      {selectedUser ? "Save" : "Add"}
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
};

export default UsersModal;
