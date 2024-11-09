import Layout from "@/components/Layout";
import { Loader } from "@/components/UI/Loader";
import { FaPen, FaTrash, FaPlus, FaTrashRestore } from "react-icons/fa";
import { UsersHead } from "@/components/Meta/Meta";
import UsersModal from "@/components/User/UserModal";
import { useCol } from "@/fiebase/dbHooks";
import ConfirmModal from "@/components/UI/ConfirmModal";
import React, { useState } from "react";
import { roles } from "@/utils/data";
import { useRecoilValue } from "recoil";
import { LoggedInUserAtom } from "@/state";
import { useRouter } from "next/router";
import { QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

const usersRouteRoles = [roles.admin, roles.qaCoordinator];

const UsersPage = () => {
  const [value, loading] = useCol<User>("users");
  const users = value?.docs || [];
  const [departments] = useCol<Department>("departments");

  const loggedInUser = useRecoilValue(LoggedInUserAtom);
  const router = useRouter();

  const [selectedUser, setSelectedUser] =
    useState<QueryDocumentSnapshot | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const [deletedUser, setDeletedUser] = useState<QueryDocumentSnapshot | null>(
    null
  );
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

  if (loggedInUser.role && !usersRouteRoles.includes(loggedInUser.role)) {
    router.replace("/");
    return <></>;
  }

  const handleUserModal = (user: QueryDocumentSnapshot | null) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUserModal = (user: QueryDocumentSnapshot | null) => {
    setDeletedUser(user);
    setIsDeleteUserModalOpen(true);
  };

  const disabledUser = () => {
    try {
      if (deletedUser) {
        updateDoc(deletedUser.ref, {
          name: deletedUser.data().name,
          email: deletedUser.data().email,
          department: deletedUser.data().department,
          role: deletedUser.data().role,
          isActive: !deletedUser.data().isActive,
        });
        setIsDeleteUserModalOpen(false);
        toast.success("Account saved.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    }
  };

  return (
    <Layout>
      <UsersHead />
      <ConfirmModal
        modalHandlers={{
          isOpen: isDeleteUserModalOpen,
          setIsOpen: setIsDeleteUserModalOpen,
        }}
        confirmHandler={disabledUser}
        message={`Are you sure you want to ${
          deletedUser?.data().isActive ? "be disable" : "reactivate"
        } ${deletedUser?.data().name} account?`}
        description={
          deletedUser?.data().isActive
            ? "This user account will be inactive and cannot be used anymore."
            : "This user account will be active and can be used."
        }
      />
      {loading ? (
        <Loader isFullHeight={false} />
      ) : (
        <section className="px-5">
          <div className="mb-6 flex flex-col space-y-5 xs:flex-row xs:items-center xs:justify-between xs:space-y-0">
            <h1 className="text-4xl font-bold">Users</h1>
            <button
              onClick={() => handleUserModal(null)}
              className="btn-primary btn gap-2 text-white"
            >
              <FaPlus /> New user
            </button>
            <UsersModal
              loggedInUser={loggedInUser}
              users={users}
              isOpen={isUserModalOpen}
              selectedUser={selectedUser}
              setIsOpen={setIsUserModalOpen}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((user) => {
                    const userObj = user.data();
                    return (
                      loggedInUser.role === roles.admin ||
                      (loggedInUser.role === roles.qaCoordinator &&
                        loggedInUser.department === userObj.department)
                    );
                  })
                  .sort((user1, user2) => {
                    return user1.data().name < user2.data().name
                      ? -1
                      : user1.data().name > user2.data().name
                      ? 1
                      : 0;
                  })
                  .map((user, i) => {
                    const userObj = user.data();

                    return (
                      <tr key={user.id}>
                        <td>{i + 1}</td>
                        <td>{userObj.name}</td>
                        <td>{userObj.email}</td>
                        <td>
                          {
                            departments?.docs
                              .find(
                                (department) =>
                                  department.id === userObj.department
                              )
                              ?.data().name
                          }
                        </td>
                        <td>{userObj.role}</td>
                        <td>
                          {userObj.isActive ? (
                            <span className="rounded-md bg-success px-2 py-1 text-center text-sm text-white">
                              Active
                            </span>
                          ) : (
                            <span className="rounded-md bg-grey-input px-2 py-1 text-center text-sm text-white">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn-outline btn-primary btn-square btn-sm btn mr-2"
                            onClick={() => handleUserModal(user)}
                            disabled={userObj.role === roles.admin}
                          >
                            <FaPen />
                          </button>
                          {userObj.isActive ? (
                            <button
                              onClick={() => handleDeleteUserModal(user)}
                              className="btn-outline btn-error btn-square btn-sm btn"
                              disabled={userObj.role === roles.admin}
                            >
                              <FaTrash />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteUserModal(user)}
                              className="btn-outline btn-success btn-square btn-sm btn"
                            >
                              <FaTrashRestore />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default UsersPage;
