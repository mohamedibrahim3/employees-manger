"use client";

import { deleteBonus } from "@/lib/actions/employee.actions";
import { useState } from "react";

interface BonusDeleteButtonProps {
  bonusId: string;
  employeeId: string;
}

const BonusDeleteButton: React.FC<BonusDeleteButtonProps> = ({
  bonusId,
  employeeId,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("هل أنت متأكد من حذف هذه العلاوة؟")) {
      setIsDeleting(true);
      const result = await deleteBonus(bonusId, employeeId);
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

export default BonusDeleteButton;
