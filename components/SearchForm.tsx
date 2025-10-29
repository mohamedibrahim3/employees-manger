"use client";

import { useState } from "react";
import Link from "next/link";
import {
  EDUCATIONAL_DEGREES,
  EDUCATIONAL_DEGREE_REVERSE_MAPPING,
  FUNCTIONAL_DEGREES,
  FUNCTIONAL_DEGREE_REVERSE_MAPPING,
} from "@/src/constants/degrees";

interface SearchSectionProps {
  administrations: string[];
}

const toArabicDigits = (num: number) => {
  return num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
};

const EFFICIENCY_GRADES = [
  { value: "EXCELLENT", label: "ممتاز" },
  { value: "COMPETENT", label: "كفء" },
  { value: "AVERAGE", label: "متوسط" },
  { value: "BELOW", label: "دون" },
];

const EFFICIENCY_GRADE_LABELS: Record<string, string> = {
  EXCELLENT: "ممتاز",
  COMPETENT: "كفء",
  AVERAGE: "متوسط",
  BELOW: "دون",
};

export default function SearchSection({ administrations }: SearchSectionProps) {
  const [name, setName] = useState("");
  const [administration, setAdministration] = useState("");
  const [educationalDegree, setEducationalDegree] = useState("");
  const [functionalDegree, setFunctionalDegree] = useState("");
  const [hasPenalties, setHasPenalties] = useState("");
  const [hasBonuses, setHasBonuses] = useState("");
  const [hasEfficiencyReports, setHasEfficiencyReports] = useState("");

  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (name) params.append("name", name);
      if (administration) params.append("administration", administration);
      if (educationalDegree)
        params.append("educationalDegree", educationalDegree);
      if (functionalDegree) params.append("functionalDegree", functionalDegree);
      if (hasPenalties) params.append("hasPenalties", hasPenalties);
      if (hasBonuses) params.append("hasBonuses", hasBonuses);
      if (hasEfficiencyReports)
        params.append("hasEfficiencyReports", hasEfficiencyReports);

      const res = await fetch(`/api/employees/search?${params.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setSearchResults(data.employees || []);
    } catch (err) {
      setError("فشل في جلب نتائج البحث. الرجاء المحاولة مرة أخرى.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const isSearchDisabled =
    loading ||
    (!name &&
      !administration &&
      !educationalDegree &&
      !functionalDegree &&
      !hasPenalties &&
      !hasBonuses &&
      !hasEfficiencyReports);

  return (
    <div className="space-y-10">
      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-4 items-end justify-center bg-white p-6 rounded-xl shadow-md border border-slate-200 flex-wrap"
      >
        {/* حقل اسم الموظف */}
        <div className="w-full md:w-1/6">
          <label className="block text-right text-slate-700 font-medium mb-2">
            اسم الموظف
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-right bg-white"
            placeholder="أدخل اسم الموظف"
            disabled={loading}
          />
        </div>

        {/* حقل الإدارة */}
        <div className="w-full md:w-1/6">
          <label className="block text-right text-slate-700 font-medium mb-2">
            الإدارة
          </label>
          <select
            value={administration}
            onChange={(e) => setAdministration(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-right bg-white"
            disabled={loading}
          >
            <option value="">اختر الإدارة</option>
            {administrations.map((admin) => (
              <option key={admin} value={admin}>
                {admin}
              </option>
            ))}
          </select>
        </div>

        {/* قائمة الدرجة العلمية */}
        <div className="w-full md:w-1/6">
          <label className="block text-right text-slate-700 font-medium mb-2">
            الدرجة العلمية
          </label>
          <select
            value={educationalDegree}
            onChange={(e) => setEducationalDegree(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-right bg-white"
            disabled={loading}
          >
            <option value="">اختر الدرجة العلمية</option>
            {EDUCATIONAL_DEGREES.map((degree) => (
              <option key={degree} value={degree}>
                {degree}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/6">
          <label className="block text-right text-slate-700 font-medium mb-2">
            الدرجة الوظيفية
          </label>
          <select
            value={functionalDegree}
            onChange={(e) => setFunctionalDegree(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-right bg-white"
            disabled={loading}
          >
            <option value="">اختر الدرجة الوظيفية</option>
            {FUNCTIONAL_DEGREES.map((degree) => (
              <option key={degree} value={degree}>
                {degree}
              </option>
            ))}
          </select>
        </div>

        {/* حقل حاصل على جزاءات */}
        <div className="w-full md:w-1/6">
          <label className="block text-right text-slate-700 font-medium mb-2">
            حاصل على جزاءات
          </label>
          <select
            value={hasPenalties}
            onChange={(e) => setHasPenalties(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-right bg-white"
            disabled={loading}
          >
            <option value="">الكل</option>
            <option value="yes">نعم</option>
            <option value="no">لا</option>
          </select>
        </div>

        {/* حقل حاصل على علاوات تشجيعية */}
        <div className="w-full md:w-1/6">
          <label className="block text-right text-slate-700 font-medium mb-2">
            حاصل على علاوات تشجيعية
          </label>
          <select
            value={hasBonuses}
            onChange={(e) => setHasBonuses(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-right bg-white"
            disabled={loading}
          >
            <option value="">الكل</option>
            <option value="yes">نعم</option>
            <option value="no">لا</option>
          </select>
        </div>

        {/* حقل درجة تقرير الكفاءة */}
        <div className="w-full md:w-1/6">
          <label className="block text-right text-slate-700 font-medium mb-2">
            درجة تقرير الكفاءة
          </label>
          <select
            value={hasEfficiencyReports}
            onChange={(e) => setHasEfficiencyReports(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-right bg-white"
            disabled={loading}
          >
            <option value="">الكل</option>
            {EFFICIENCY_GRADES.map((grade) => (
              <option key={grade.value} value={grade.value}>
                {grade.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className={`w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 hover:from-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSearchDisabled}
        >
          {loading ? "جاري البحث..." : "بحث"}
        </button>
      </form>

      {error && (
        <div className="text-center text-red-600 text-base font-medium py-4 bg-red-50/50 rounded-xl border border-red-200/50">
          {error}
        </div>
      )}

      {hasSearched && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 p-8 space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 rounded-xl mb-6">
            <h3 className="text-2xl font-medium text-white text-center">
              نتائج البحث
            </h3>
          </div>

          {/* 💡 عرض إجمالي عدد الموظفين */}
          {searchResults.length > 0 && (
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 shadow-md border-2 border-slate-200 min-w-[300px]">
                <div className="text-center">
                  <p className="text-slate-700 font-medium text-lg mb-2">
                    إجمالي عدد الموظفين
                  </p>
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2">
                    {toArabicDigits(searchResults.length)}
                  </div>
                  <p className="text-slate-600 font-medium">
                    موظف
                    {(educationalDegree ||
                      functionalDegree ||
                      hasPenalties ||
                      hasBonuses ||
                      hasEfficiencyReports) && (
                      <span className="block mt-2 text-sm">
                        {educationalDegree && (
                          <>
                            حاصلين على:{" "}
                            <span className="font-bold text-slate-800">
                              {educationalDegree}
                            </span>
                          </>
                        )}
                        {educationalDegree &&
                          (functionalDegree ||
                            hasPenalties ||
                            hasBonuses ||
                            hasEfficiencyReports) &&
                          "، "}
                        {functionalDegree && (
                          <>
                            الدرجة الوظيفية:{" "}
                            <span className="font-bold text-slate-800">
                              {functionalDegree}
                            </span>
                          </>
                        )}
                        {functionalDegree &&
                          (hasPenalties ||
                            hasBonuses ||
                            hasEfficiencyReports) &&
                          "، "}
                        {hasPenalties && (
                          <>
                            {hasPenalties === "yes"
                              ? "حاصلين على جزاءات"
                              : "غير حاصلين على جزاءات"}
                          </>
                        )}
                        {hasPenalties &&
                          (hasBonuses || hasEfficiencyReports) &&
                          "، "}
                        {hasBonuses && (
                          <>
                            {hasBonuses === "yes"
                              ? "حاصلين على علاوات تشجيعية"
                              : "غير حاصلين على علاوات تشجيعية"}
                          </>
                        )}
                        {hasBonuses && hasEfficiencyReports && "، "}
                        {hasEfficiencyReports && (
                          <>
                            حاصلين على درجة تقرير كفاءة:{" "}
                            <span className="font-bold text-slate-800">
                              {
                                EFFICIENCY_GRADE_LABELS[
                                  hasEfficiencyReports as keyof typeof EFFICIENCY_GRADE_LABELS
                                ]
                              }
                            </span>
                          </>
                        )}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {searchResults.length === 0 ? (
            <div className="text-center py-8 text-slate-600 text-base font-medium">
              {loading ? "جاري البحث..." : "لا توجد نتائج مطابقة للبحث"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((emp) => (
                <div
                  key={emp.id}
                  className="p-6 bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 group"
                >
                  <h4 className="text-lg font-medium text-slate-800 mb-2 group-hover:text-slate-700 transition-colors">
                    {emp.name}
                  </h4>
                  <p className="text-slate-600 font-medium mb-1 text-sm">
                    الإدارة:{" "}
                    <span className="text-slate-800">{emp.administration}</span>
                  </p>
                  <p className="text-slate-600 font-medium mb-1 text-sm">
                    الدرجة العلمية:{" "}
                    <span className="text-slate-800">
                      {emp.educationalDegree
                        ? EDUCATIONAL_DEGREE_REVERSE_MAPPING[
                            emp.educationalDegree
                          ] || emp.educationalDegree
                        : "-"}
                    </span>
                  </p>
                  <p className="text-slate-600 font-medium mb-4 text-sm">
                    الدرجة الوظيفية:{" "}
                    <span className="text-slate-800">
                      {emp.functionalDegree
                        ? FUNCTIONAL_DEGREE_REVERSE_MAPPING[
                            emp.functionalDegree
                          ] || emp.functionalDegree
                        : "-"}
                    </span>
                  </p>
                  <Link
                    href={`/employees/employee/${emp.id}`}
                    className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 hover:from-blue-700"
                  >
                    عرض التفاصيل
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
