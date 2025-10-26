"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { createPenalty, updatePenalty } from "@/lib/actions/employee.actions";

dayjs.locale("ar");

const penaltySchema = z.object({
  date: z.string().min(1, "التاريخ مطلوب"),
  type: z.string().min(1, "نوع الجزاء مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  attachments: z.string().optional(),
});

type PenaltyForm = z.infer<typeof penaltySchema>;

interface PenaltiesModalProps {
  employeeId: string;
  penalty?: {
    id?: string;
    date: string;
    type: string;
    description: string;
    attachments?: string;
  };
  className?: string;
}

const PENALTY_TYPES = [
  { value: "WARNING", label: "إنذار" },
  { value: "DEDUCTION", label: "خصم" },
  { value: "SUSPENSION", label: "إيقاف" },
  { value: "NOTE", label: "لفت نظر" },
  { value: "TERMINATION", label: "فصل" },
];

const PenaltiesModal: React.FC<PenaltiesModalProps> = ({ employeeId, penalty, className }) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PenaltyForm>({
    resolver: zodResolver(penaltySchema),
    defaultValues: penalty
      ? {
          date: dayjs(penalty.date).format("DD/MM/YYYY"),
          type: penalty.type,
          description: penalty.description,
          attachments: penalty.attachments || "",
        }
      : { date: "", type: "", description: "", attachments: "" },
  });

  const onSubmit = async (data: PenaltyForm) => {
    // تحويل التاريخ لصيغة ISO قبل الإرسال
    const formattedDate = dayjs(data.date, "DD/MM/YYYY").toISOString();
    const payload = { ...data, date: formattedDate };

    const action = penalty?.id
      ? updatePenalty(penalty.id, employeeId, payload)
      : createPenalty(employeeId, payload);

    const result = await action;
    if (result.success) {
      setOpen(false);
      reset();
    } else {
      alert(result.error);
    }
  };

  // تنسيق الإدخال أثناء الكتابة
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // إزالة أي شيء غير أرقام
    if (value.length >= 5) {
      value = value.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
    } else if (value.length >= 3) {
      value = value.replace(/(\d{2})(\d{0,2})/, "$1/$2");
    }
    setValue("date", value);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className={
          className ||
          "inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2 rounded-xl transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
        }
      >
        {penalty ? "تعديل" : "إضافة جزاء"}
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
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold">{penalty ? "تعديل الجزاء" : "إضافة جزاء جديد"}</h2>
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
                {/* التاريخ بصيغة اليوم/الشهر/السنة */}
                <div>
                  <label htmlFor="date" className="block text-gray-700 font-semibold mb-2">
                    التاريخ (يوم / شهر / سنة)
                  </label>
                  <input
                    type="text"
                    id="date"
                    value={watch("date")}
                    onChange={handleDateChange}
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
                  />
                  {errors.date && (
                    <p className="text-red-600 text-sm mt-2">{errors.date.message}</p>
                  )}
                </div>

                {/* نوع الجزاء */}
                <div>
                  <label htmlFor="type" className="block text-gray-700 font-semibold mb-2">
                    نوع الجزاء
                  </label>
                  <select
                    id="type"
                    {...register("type")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none bg-white"
                  >
                    <option value="">اختر نوع الجزاء</option>
                    {PENALTY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && <p className="text-red-600 text-sm mt-2">{errors.type.message}</p>}
                </div>
              </div>

              {/* الوصف */}
              <div>
                <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
                  الوصف
                </label>
                <textarea
                  id="description"
                  rows={5}
                  {...register("description")}
                  placeholder="اكتب وصف الجزاء هنا..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none resize-none"
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-2">{errors.description.message}</p>
                )}
              </div>

              {/* المرفقات */}
              <div>
                <label htmlFor="attachments" className="block text-gray-700 font-semibold mb-2">
                  المرفقات (رابط)
                  <span className="text-sm text-gray-500 font-normal">(اختياري)</span>
                </label>
                <input
                  type="url"
                  id="attachments"
                  {...register("attachments")}
                  placeholder="https://example.com/file"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
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
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
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

export default PenaltiesModal;
