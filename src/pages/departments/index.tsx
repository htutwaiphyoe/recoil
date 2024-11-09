import DepartmentModal from "@/components/Department/DepartmentModal";
import Layout from "@/components/Layout";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { deleteData, useCol } from "@/fiebase/dbHooks";
import { useState } from "react";
import ConfirmModal from "@/components/UI/ConfirmModal";
import { toast } from "react-hot-toast";
import { Loader } from "@/components/UI/Loader";
import { FaPlus, FaPen, FaTrash } from "react-icons/fa";
import EmptyList from "@/components/UI/EmptyList";
import { DepartmentsHead } from "@/components/Meta/Meta";
import { useRecoilValue } from "recoil";
import { LoggedInUserAtom } from "@/state";
import { useRouter } from "next/router";
import { roles } from "@/utils/data";

const departmentRouteRoles = [roles.admin, roles.qaCoordinator];

function Department({
  department: deptDoc,
  number,
  setEditDepartmentId,
  setDeleteDepartmentId,
}: {
  department: QueryDocumentSnapshot;
  number: number;
  setEditDepartmentId: any;
  setDeleteDepartmentId: any;
}) {
  const dept: Department = deptDoc.data() as Department;

  return (
    <tr>
      <td>{number}</td>
      <td>{dept.name}</td>
      <td>
        <button
          className="btn-outline btn-primary btn-square btn-sm btn"
          onClick={() => {
            setEditDepartmentId(deptDoc.id);
          }}
        >
          <FaPen />
        </button>
        <button
          className="btn-outline btn-error btn-square btn-sm btn ml-2"
          onClick={() => {
            setDeleteDepartmentId(deptDoc.id);
          }}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}

function DepartmentList({
  departments = [],
  setEditDepartmentId,
  setDeleteDepartmentId,
}: {
  departments: Array<QueryDocumentSnapshot>;
  setEditDepartmentId?: any;
  setDeleteDepartmentId?: any;
}) {
  const loggedInUser = useRecoilValue(LoggedInUserAtom);

  return (
    <>
      {departments && departments.length > 0 ? (
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
              {departments
                .filter(
                  (dept) =>
                    loggedInUser.role === roles.admin ||
                    (loggedInUser.role === roles.qaCoordinator &&
                      loggedInUser.department === dept.id)
                )
                .map((dept: QueryDocumentSnapshot, idx) => (
                  <Department
                    key={dept.id}
                    number={idx + 1}
                    department={dept}
                    setEditDepartmentId={setEditDepartmentId}
                    setDeleteDepartmentId={setDeleteDepartmentId}
                  />
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyList emptyText="No department for now." />
      )}
    </>
  );
}

export default function Departments() {
  const [value, loading] = useCol<Department>("departments", {});
  const departments: Array<QueryDocumentSnapshot> = value?.docs || [];

  const loggedInUser = useRecoilValue(LoggedInUserAtom);
  const router = useRouter();

  const [users] = useCol<User>("users");

  const [editDepartmentId, setEditDepartmentId] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const handleEditModalOpening = (id: string) => {
    setEditDepartmentId(id);
    setIsFormModalOpen(true);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteDepartmentId, setDeleteDepartmentId] = useState("");
  const handleDeleteModalOpening = (id: string) => {
    setDeleteDepartmentId(id);
    setIsDeleteModalOpen(true);
  };

  if (loggedInUser.role && !departmentRouteRoles.includes(loggedInUser.role)) {
    router.replace("/");
    return <></>;
  }

  const handleDeleteDepartment = async () => {
    try {
      const departmentIds = users?.docs.map((user) => user.data().department);
      const isUserExist = departmentIds?.includes(deleteDepartmentId);
      if (isUserExist) {
        setIsDeleteModalOpen(false);
        setDeleteDepartmentId("");
        toast.error(
          "This department cannot be deleted since there is a user related with."
        );
      } else {
        await deleteData(`departments/${deleteDepartmentId}`);
        setIsDeleteModalOpen(false);
        setDeleteDepartmentId("");
        toast.success("Department deleted.");
      }
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };

  return (
    <Layout>
      <DepartmentsHead />
      {loading ? (
        <Loader isFullHeight={false} />
      ) : (
        <section className="px-5">
          <div className="mb-4">
            <div className="mb-6 flex flex-col space-y-5 px-3 xs:flex-row xs:items-center xs:justify-between xs:space-y-0">
              <h1 className="text-4xl font-bold">Departments</h1>
              {loggedInUser.role && loggedInUser.role === roles.admin && (
                <button
                  onClick={() => handleEditModalOpening("")}
                  className="btn-primary btn gap-2 text-white"
                >
                  <FaPlus /> New Department
                </button>
              )}
            </div>
            <DepartmentModal
              isOpen={isFormModalOpen}
              departmentId={editDepartmentId}
              setIsOpen={setIsFormModalOpen}
            />
            <ConfirmModal
              modalHandlers={{
                isOpen: isDeleteModalOpen,
                setIsOpen: setIsDeleteModalOpen,
              }}
              confirmHandler={handleDeleteDepartment}
              message={"Are you sure you want to delete this department?"}
            />
          </div>
          <DepartmentList
            departments={departments}
            setEditDepartmentId={handleEditModalOpening}
            setDeleteDepartmentId={handleDeleteModalOpening}
          />
        </section>
      )}
    </Layout>
  );
}
