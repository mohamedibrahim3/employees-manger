"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { createBonus, updateBonus } from "@/lib/actions/employee.actions";

dayjs.extend(customParseFormat);
dayjs.locale("ar");

const bonusSchema = z.object({
  date: z
    .string()
    .min(1, "التاريخ مطلوب")
    .refine((val) => dayjs(val, "DD/MM/YYYY", true).isValid(), {
      message: "صيغة التاريخ غير صحيحة (يجب أن تكون DD/MM/YYYY)",
    }),
  reason: z.string().min(1, "الموقف مطلوب"),
  amount: z.string().optional(),
  attachments: z.string().optional(),
});

type BonusForm = z.infer<typeof bonusSchema>;

interface BonusesModalProps {
  employeeId: string;
  bonus?: {
    id?: string;
    date: string;
    reason: string;
    amount?: string;
    attachments?: string;
  };
  className?: string;
}

const BonusesModal: React.FC<BonusesModalProps> = ({
  employeeId,
  bonus,
  className,
}) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BonusForm>({
    resolver: zodResolver(bonusSchema),
    defaultValues: bonus
      ? {
          date: dayjs(bonus.date).format("DD/MM/YYYY"),
          reason: bonus.reason,
          amount: bonus.amount || "",
          attachments: bonus.attachments || "",
        }
      : { date: "", reason: "", amount: "", attachments: "" },
  });

  // تنسيق الإدخال أثناء الكتابة (مثل PenaltiesModal)
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // إزالة أي شيء غير رقم
    if (value.length >= 5) {
      value = value.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
    } else if (value.length >= 3) {
      value = value.replace(/(\d{2})(\d{0,2})/, "$1/$2");
    }
    setValue("date", value);
  };

  const onSubmit = async (data: BonusForm) => {
    // تحويل التاريخ لصيغة ISO
    const formattedDate = dayjs(data.date, "DD/MM/YYYY").toISOString();
    const payload = { ...data, date: formattedDate };

    const action = bonus?.id
      ? updateBonus(bonus.id, employeeId, payload)
      : createBonus(employeeId, payload);

    const result = await action;
    if (result.success) {
      setOpen(false);
      reset();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className={
          className ||
          "inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-4 py-2 rounded-xl transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
        }
      >
        {bonus ? "تعديل" : "إضافة علاوة"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setOpen(false);
              reset();
            }}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {bonus ? "تعديل العلاوة" : "إضافة علاوة تشجيعية جديدة"}
              </h2>
              <button
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* التاريخ بصيغة يوم/شهر/سنة */}
                <div>
                  <label
                    htmlFor="date"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    التاريخ (يوم / شهر / سنة)
                  </label>
                  <input
                    type="text"
                    id="date"
                    value={watch("date")}
                    onChange={handleDateChange}
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none"
                  />
                  {errors.date && (
                    <p className="text-red-600 text-sm mt-2">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                {/* قيمة العلاوة */}
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    قيمة العلاوة
                  </label>
                  <input
                    type="text"
                    id="amount"
                    {...register("amount")}
                    placeholder="مثال: 500 جنيه"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none"
                  />
                </div>
              </div>

              {/* السبب */}
              <div>
                <label
                  htmlFor="reason"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  الموقف / السبب
                </label>
                <textarea
                  id="reason"
                  rows={5}
                  {...register("reason")}
                  placeholder="اكتب سبب العلاوة هنا..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none resize-none"
                />
                {errors.reason && (
                  <p className="text-red-600 text-sm mt-2">
                    {errors.reason.message}
                  </p>
                )}
              </div>

              {/* المرفقات */}
              <div>
                <label
                  htmlFor="attachments"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  المرفقات (رابط)
                </label>
                <input
                  type="url"
                  id="attachments"
                  {...register("attachments")}
                  placeholder="https://example.com/file"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none"
                />
              </div>

              {/* الأزرار */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    reset();
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BonusesModal;
