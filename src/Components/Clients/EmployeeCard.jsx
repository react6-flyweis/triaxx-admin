import { AiFillStar } from "react-icons/ai";
import avatarImg from "../../assets/Images/admin/client/global-user.png";

const EmployeeCard = ({
  role = "Role",
  description = "Employee description",
  rating = 4.5,
  reviews = 200,
  completion = 95,
  employees = [],
  count = 2,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 max-w-[320px]">
      {/* Title + description */}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold text-gray-800">{role}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      {/* Rating row */}
      <div className="flex items-center gap-3 mt-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <AiFillStar
              key={i}
              className={`text-[14px] ${
                i < Math.round(rating) ? "text-yellow-400" : "text-gray-200"
              }`}
            />
          ))}
        </div>
        <div className="text-sm text-gray-600 font-semibold">
          {reviews}+ reviews
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            style={{ width: `${completion}%` }}
            className="h-full bg-linear-to-r from-[#6A1B9A] to-[#D32F2F] rounded-full"
          />
        </div>
      </div>

      {/* Bottom: avatars + count */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center -space-x-3">
            {employees.slice(0, 4).map((emp, idx) => (
              <img
                key={idx}
                src={emp?.avatar || avatarImg}
                alt={emp?.name || "avatar"}
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                style={{ zIndex: 10 - idx }}
              />
            ))}
            {employees.length > 4 && (
              <div className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-xs text-gray-700 ml-1">
                +{employees.length - 4}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">{count}</div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-linear-to-b from-[#6A1B9A] to-[#D32F2F] shadow">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 10.5V6.75A2.75 2.75 0 0 0 18.25 4H5.75A2.75 2.75 0 0 0 3 6.75v10.5A2.75 2.75 0 0 0 5.75 20h11.5A2.75 2.75 0 0 0 20 17.25V13.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 14.5h3l2 2h4"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
