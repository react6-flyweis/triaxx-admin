import { useState, useEffect } from "react";
import deleteIcon from "../../assets/Images/Settings/1.png";
import AddPaymentModal from "./AddPaymentModal";
import {
  FaCreditCard,
  FaPaypal,
  FaGooglePay,
  FaApplePay,
} from "react-icons/fa";
import { RiBankLine } from "react-icons/ri";
import DeletePaymentConfirmModal from "./DeletePaymentConfirmModal";
import { usePayments } from "@/hooks/usePayments";
import { useCreatePayment } from "@/hooks/useCreatePayment";
import { useDeletePayment } from "@/hooks/useDeletePayment";

const Payments = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentModes, setPaymentModes] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const { data, isLoading, isError, error } = usePayments();

  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      const mapped = data.data.map((pt) => ({
        id: pt._id,
        name: pt.Name || pt.name || "Unknown",
        desc: pt.nodes || pt.description || "",
      }));
      setPaymentModes(mapped);
    }
  }, [data]);

  const createPayment = useCreatePayment();
  const deletePayment = useDeletePayment();

  const handleAddPayment = () => {
    if (!paymentMode.trim()) return;

    const payload = {
      Name: paymentMode,
      nodes: paymentMode,
      Status: true,
    };

    createPayment.mutate(payload, {
      onSuccess: () => {
        setPaymentMode("");
        setIsAddModalOpen(false);
      },
      onError: (err) => {
        console.error("Create payment failed", err);
      },
    });
  };

  const getIconForName = (name) => {
    const n = (name || "").toLowerCase();
    if (n.includes("card")) return <FaCreditCard size={24} />;
    if (n.includes("cash")) return <RiBankLine size={24} />;
    if (n.includes("apple")) return <FaApplePay size={24} />;
    if (n.includes("google")) return <FaGooglePay size={24} />;
    if (n.includes("stripe")) return <FaPaypal size={24} />;
    if (n.includes("paypal")) return <FaPaypal size={24} />;
    return <FaCreditCard size={24} />;
  };

  return (
    <div className="px-4 md:px-10 py-6 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black text-center sm:text-left">
          Payments
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-linear-to-r from-purple-800 to-red-600 text-white px-4 py-2 rounded-md font-medium shadow flex items-center gap-2"
        >
          Add New Payment Mode <span className="text-xl">＋</span>
        </button>
      </div>

      {/* Payment Mode Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            {/* Skeleton placeholders while loading */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="w-full border border-black rounded-lg flex items-center justify-between px-4 py-3 bg-white shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex flex-col gap-2 w-40">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
                  </div>
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </>
        ) : isError ? (
          <div className="col-span-full text-center text-red-600">
            {error?.message || "Failed to load payment methods"}
          </div>
        ) : (
          paymentModes.map((mode) => (
            <div
              key={mode.id}
              className="w-full border border-black rounded-lg flex items-center justify-between px-4 py-3 bg-white shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  {getIconForName(mode.name)}
                </div>
                <div>
                  <span className="text-base md:text-lg font-medium">
                    {mode.name}
                  </span>
                  {mode.desc ? (
                    <div className="text-xs text-gray-500">{mode.desc}</div>
                  ) : null}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPayment(mode);
                  setIsDeleteModalOpen(true);
                }}
              >
                <img src={deleteIcon} alt="Delete" className="w-6 h-6" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddPayment}
        paymentMode={paymentMode}
        setPaymentMode={setPaymentMode}
      />

      {/* Delete Confirmation Modal */}
      <DeletePaymentConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (!selectedPayment) return;
          deletePayment.mutate(selectedPayment.id, {
            onSuccess: () => {
              // remove locally for instant feedback — hook also invalidates query
              setPaymentModes((prev) =>
                prev.filter((p) => p.id !== selectedPayment.id)
              );
              setSelectedPayment(null);
              setIsDeleteModalOpen(false);
            },
            onError: (err) => {
              console.error("Delete payment failed", err);
            },
          });
        }}
        isLoading={deletePayment.isPending}
        title="Delete Card Payment"
        description="You can delete this payment method permanently."
      />
    </div>
  );
};

export default Payments;
