import { FaInfoCircle } from "react-icons/fa";

export default function EmptyList({
  emptyText = "No list found",
}: {
  emptyText?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 p-10 text-center">
      <FaInfoCircle className="text-3xl" />{" "}
      <p className="text-lg">{emptyText}</p>
    </div>
  );
}
