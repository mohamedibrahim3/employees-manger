"use client";

import { useState } from "react";
import Link from "next/link";
import {
  EDUCATIONAL_DEGREES,
  EDUCATIONAL_DEGREE_REVERSE_MAPPING,
} from "@/src/constants/degrees";

interface SearchSectionProps {
  administrations: string[];
}

export default function SearchSection({ administrations }: SearchSectionProps) {
  const [name, setName] = useState("");
  const [administration, setAdministration] = useState("");
  const [educationalDegree, setEducationalDegree] = useState("");

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
    loading || (!name && !administration && !educationalDegree);

  return (
    <div className="space-y-10">
      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-4 items-end justify-center bg-white/90 p-6 rounded-2xl shadow-md border border-gray-200"
      >
        {/* حقل اسم الموظف */}
        <div className="w-full md:w-1/4">
          <label className="block text-right text-gray-700 font-medium mb-2">
            اسم الموظف
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-gray-500 focus:outline-none text-right bg-white/80 backdrop-blur-sm"
            placeholder="أدخل اسم الموظف"
            disabled={loading}
          />
        </div>

        {/* حقل الإدارة */}
        <div className="w-full md:w-1/4">
          <label className="block text-right text-gray-700 font-medium mb-2">
            الإدارة
          </label>
          <select
            value={administration}
            onChange={(e) => setAdministration(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-gray-500 focus:outline-none text-right bg-white/80 backdrop-blur-sm"
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
        <div className="w-full md:w-1/4">
          <label className="block text-right text-gray-700 font-medium mb-2">
            الدرجة العلمية
          </label>
          <select
            value={educationalDegree}
            onChange={(e) => setEducationalDegree(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-gray-500 focus:outline-none text-right bg-white/80 backdrop-blur-sm"
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

        {/* زر البحث */}
        <button
          type="submit"
          className={`w-full md:w-auto px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-xl font-medium text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-gray-600 hover:to-gray-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSearchDisabled}
        >
          {loading ? "جاري البحث..." : "بحث"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-600 text-base font-medium py-4 bg-red-50 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* Search Results */}
      {hasSearched && (
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-gray-200 p-8 space-y-6">
          <div className="bg-gradient-to-r from-gray-800 to-gray-600 px-8 py-6 rounded-2xl mb-6">
            <h3 className="text-2xl font-medium text-white text-center">
              نتائج البحث
            </h3>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-8 text-gray-600 text-base font-medium">
              {loading ? "جاري البحث..." : "لا توجد نتائج مطابقة للبحث"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((emp) => (
                <div
                  key={emp.id}
                  className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 group"
                >
                  <h4 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-gray-700 transition-colors">
                    {emp.name}
                  </h4>
                  <p className="text-gray-600 font-medium mb-1 text-sm">
                    الإدارة:{" "}
                    <span className="text-gray-800">{emp.administration}</span>
                  </p>
                  <p className="text-gray-600 font-medium mb-4 text-sm">
                    الدرجة العلمية:{" "}
                    <span className="text-gray-800">
                      {emp.educationalDegree
                        ? EDUCATIONAL_DEGREE_REVERSE_MAPPING[
                            emp.educationalDegree
                          ] || emp.educationalDegree
                        : "-"}
                    </span>
                  </p>
                  <Link
                    href={`/employees/employee/${emp.id}`}
                    className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-gray-600 hover:to-gray-700"
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
