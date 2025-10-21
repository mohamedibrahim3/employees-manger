"use client";

import { deletePenalty } from "@/lib/actions/employee.actions";
import { useState } from "react";

interface PenaltyDeleteButtonProps {
  penaltyId: string;
  employeeId: string;
}

const PenaltyDeleteButton: React.FC<PenaltyDeleteButtonProps> = ({ 
  penaltyId, 
  employeeId 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("هل أنت متأكد من حذف هذا الجزاء؟")) {
      setIsDeleting(true);
      const result = await deletePenalty(penaltyId, employeeId);
      if (!result.success) {
        alert(result.error);
      }
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? "جاري الحذف..." : "حذف"}
    </button>
  );
};

export default PenaltyDeleteButton;