"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import {
  createEfficiencyReport,
  updateEfficiencyReport,
} from "@/lib/actions/employee.actions";
import { efficiencyGradeEnum, EfficiencyGrade } from "@/lib/validators";

const efficiencyReportSchema = z.object({
  year: z
    .string()
    .min(1, "سنة التقرير مطلوبة")
    .regex(/^\d{4}$/, "السنة يجب أن تكون أربعة أرقام"),
  grade: efficiencyGradeEnum,
  description: z.string().min(1, "الوصف مطلوب"),
  attachments: z.string().optional(),
});

type EfficiencyReportForm = z.infer<typeof efficiencyReportSchema>;

interface EfficiencyReportsModalProps {
  employeeId: string;
  efficiencyReport?: {
    id?: string;
    year: number;
    grade: EfficiencyGrade;
    description: string;
    attachments?: string;
  };
  className?: string;
}

const EFFICIENCY_GRADES = [
  { value: "EXCELLENT", label: "ممتاز" },
  { value: "COMPETENT", label: "كفء" },
  { value: "AVERAGE", label: "متوسط" },
  { value: "BELOW", label: "دون" },
];

const EfficiencyReportsModal: React.FC<EfficiencyReportsModalProps> = ({
  employeeId,
  efficiencyReport,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EfficiencyReportForm>({
    resolver: zodResolver(efficiencyReportSchema),
    defaultValues: efficiencyReport
      ? {
          year: dayjs(`${efficiencyReport.year}`).format("YYYY"),
          grade: efficiencyReport.grade,
          description: efficiencyReport.description,
          attachments: efficiencyReport.attachments || "",
        }
      : {
          year: "",
          grade: "" as EfficiencyGrade,
          description: "",
          attachments: "",
        },
  });

  const onSubmit = async (data: EfficiencyReportForm) => {
    const action = efficiencyReport?.id
      ? updateEfficiencyReport(efficiencyReport.id, employeeId, data)
      : createEfficiencyReport(employeeId, data);
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
          "inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-xl transition-all font-medium shadow-lg"
        }
      >
        {efficiencyReport ? "تعديل" : "إضافة تقرير كفاءة"}
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

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {efficiencyReport
                  ? "تعديل تقرير الكفاءة"
                  : "إضافة تقرير كفاءة جديد"}
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
                {/* السنة */}
                <div>
                  <label
                    htmlFor="year"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    سنة التقرير
                  </label>
                  <input
                    type="number"
                    id="year"
                    {...register("year")}
                    min="1900"
                    max="2100"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                  />
                  {errors.year && (
                    <p className="text-red-600 text-sm mt-2">
                      {errors.year.message}
                    </p>
                  )}
                </div>

                {/* الدرجة */}
                <div>
                  <label
                    htmlFor="grade"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    درجة التقرير
                  </label>
                  <select
                    id="grade"
                    {...register("grade")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white"
                  >
                    <option value="">اختر درجة التقرير</option>
                    {EFFICIENCY_GRADES.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                  {errors.grade && (
                    <p className="text-red-600 text-sm mt-2">
                      {errors.grade.message}
                    </p>
                  )}
                </div>
              </div>

              {/* الوصف */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  الوصف
                </label>
                <textarea
                  id="description"
                  rows={5}
                  {...register("description")}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none"
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-2">
                    {errors.description.message}
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                  placeholder="https://example.com/file"
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
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl"
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

export default EfficiencyReportsModal;
