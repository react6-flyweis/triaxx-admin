import { Pencil } from "lucide-react";
import withAdminLayout from "../../Views/AdminPanel/withAdminLayout";
import arrow from "../../assets/Images/Home/arrow.png";
import deleteIcon from "../../assets/Images/Settings/1.png";
import { useState } from "react";
import CreateSubAdminModal from "./CreateSubAdminModal";
import ConfirmationModal from "./ConfirmationModalAdmin";
import useSubAdmins from "../../hooks/useSubAdmins";
import useDeactivateUser from "../../hooks/useDeactivateUser";

const SubAdminTable = () => {
  const [selectedToDelete, setSelectedToDelete] = useState(null);
  const handleOpenModal = (admin) => setSelectedToDelete(admin);
  const handleCloseModal = () => setSelectedToDelete(null);

  const [open, setOpen] = useState(false);
  const {
    data: subAdmins = [],
    isLoading: loading,
    isError,
    error,
  } = useSubAdmins(5);
  const {
    mutate: deactivate,
    isLoading: isDeleting,
    isError: deleteError,
  } = useDeactivateUser({
    onSuccess: () => {
      // close modal handled in confirm handler below, but also ensure selected cleared
      setSelectedToDelete(null);
    },
  });

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex flex-wrap items-center gap-2 text-[28px] md:text-[32px]">
          <span className="text-gray-400 flex items-center gap-2">
            Account Settings
            <img src={arrow} alt="Arrow" className="w-4 h-4 inline-block" />
          </span>
          Sub Admins
        </h1>

        <button
          className="text-white px-4 py-2 rounded-md font-medium shadow w-full md:w-auto"
          style={{
            background: "linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)",
          }}
          onClick={() => setOpen(true)}
        >
          Create Sub admin +
        </button>
      </div>

      {/* Table - scrolls horizontally on small screens */}
      <div className="border border-gray-300 rounded-t-xl overflow-x-auto">
        <div className="min-w-[1024px]">
          {/* Table Header */}
          <div className="bg-gradient-to-b from-purple-100 to-red-100 py-3 px-6 grid grid-cols-5 gap-2 text-sm font-semibold text-gray-600">
            <div>S no</div>
            <div>Name</div>
            <div>Email</div>
            <div>Permissions</div>
            <div className="text-center">Actions</div>
          </div>

          {/* Table Rows */}
          {loading && (
            <div className="px-6 py-4 border-t border-gray-300 bg-white">
              Loading...
            </div>
          )}
          {isError && (
            <div className="px-6 py-4 border-t border-gray-300 bg-white text-red-600">
              {error?.message || "Failed to load"}
            </div>
          )}
          {!loading && !isError && subAdmins.length === 0 && (
            <div className="px-6 py-4 border-t border-gray-300 bg-white">
              No sub admins found.
            </div>
          )}
          {!loading &&
            !isError &&
            subAdmins.map((admin, idx) => {
              const perms = admin?.SubAdmin_Permissions?.IsPermissons || [];
              return (
                <div
                  key={admin._id || admin.user_id || idx}
                  className="grid grid-cols-5 gap-2 px-6 py-4 border-t border-gray-300 bg-white"
                >
                  <div>{idx + 1}</div>
                  <div>{admin?.Name || admin?.name || "—"}</div>
                  <div className="break-words">{admin?.email || "—"}</div>
                  <div className="flex flex-wrap gap-2">
                    {perms.map((p, index) => (
                      <span
                        key={p._id || index}
                        className="bg-pink-100 text-black text-sm font-semibold px-2 py-1 rounded-md"
                      >
                        {p.type || p}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      className="p-2"
                      onClick={() => handleOpenModal(admin)}
                      disabled={isDeleting}
                    >
                      <img src={deleteIcon} alt="delete" className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 rounded-full bg-black"
                      onClick={() => setOpen(true)}
                    >
                      <Pencil className="text-white w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Modals */}
      <CreateSubAdminModal open={open} onOpenChange={setOpen} />

      <ConfirmationModal
        isOpen={Boolean(selectedToDelete)}
        onClose={handleCloseModal}
        onConfirm={() => {
          if (!selectedToDelete) return;
          const id = selectedToDelete.user_id ?? selectedToDelete._id;
          deactivate(id);
        }}
        title="Are you sure?"
        description="You can see your employee's roles and responsibilities. You can delete your employees as well."
      />
      {deleteError && (
        <div className="text-red-600 mt-2">
          Failed to delete: {deleteError?.message}
        </div>
      )}
    </div>
  );
};

export default withAdminLayout(SubAdminTable);
