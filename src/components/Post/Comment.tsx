import { useDocData } from "@/fiebase/dbHooks";
import { FaUserSecret } from "react-icons/fa";

const Comment = ({ doc }: { doc: any }) => {
  const data = doc?.data();

  const [user] = useDocData<{
    name: string;
    img: string;
    isAnonymous: boolean;
  }>(`users/${data?.userId}`);

  return (
    <div
      key={doc.id}
      className="pre col-span-2 flex gap-2 border-b border-b-grey-light pb-4"
    >
      {data?.isAnonymous ? (
        <div>
          <div className="flex h-[40px] w-[40px] flex-row items-center justify-center rounded-full border p-1">
            <FaUserSecret size="20px" />
          </div>
        </div>
      ) : (
        <div className="placeholder avatar">
          <div className="h-[40px] w-[40px] rounded-full bg-neutral-focus text-neutral-content">
            <span className="text-xs">{user?.name?.[0]}</span>
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-bold">
          {data?.isAnonymous ? "Anonymous User" : user?.name}{" "}
          <span className="font-normal">
            {`@ ${data?.createdAt.toDate().toDateString()} - ${
              data?.createdAt.toDate().toTimeString().split(" ")?.[0]
            }`}
          </span>
        </p>
        <p className="font- break-all text-base">{data?.message}</p>
      </div>
    </div>
  );
};

export default Comment;
