"use client";

import { useState } from "react";
import Link from "next/link";

interface SearchSectionProps {
  administrations: string[];
}

export default function SearchSection({ administrations }: SearchSectionProps) {
  const [name, setName] = useState("");
  const [administration, setAdministration] = useState("");
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

      console.log("Making request to:", `/api/employees/search?${params.toString()}`);

      const res = await fetch(`/api/employees/search?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await res.text();
        console.error("Non-JSON response:", responseText);
        throw new Error("Received non-JSON response");
      }

      const data = await res.json();
      console.log("Search response data:", data);
      
      setSearchResults(data.employees || []);
    } catch (err) {
      console.error("Search error:", err);
      setError("فشل في جلب نتائج البحث. الرجاء المحاولة مرة أخرى.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end justify-center">
        <div className="w-full md:w-1/3">
          <label className="block text-right text-gray-700 font-semibold mb-2">اسم الموظف</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none text-right"
            placeholder="أدخل اسم الموظف"
            disabled={loading}
          />
        </div>
        <div className="w-full md:w-1/3">
          <label className="block text-right text-gray-700 font-semibold mb-2">الإدارة</label>
          <select
            value={administration}
            onChange={(e) => setAdministration(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none text-right"
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
        <button
          type="submit"
          className={`w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-purple-500 hover:to-blue-500 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || (!name && !administration)}
        >
          {loading ? (
            <span className="flex items-center">
              جاري البحث...
              <svg
                className="animate-spin mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          ) : (
            "بحث"
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-4 text-center text-red-600 text-lg">
          {error}
        </div>
      )}

      {/* Search Results */}
      {hasSearched && (
        <div className="mt-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 px-12 py-8">
              <h3 className="text-3xl font-bold text-white text-center">
                نتائج البحث
              </h3>
            </div>
            <div className="overflow-x-auto">
              {searchResults.length === 0 ? (
                <div className="text-center py-12 text-gray-600 text-xl">
                  {loading ? "جاري البحث..." : "لا توجد نتائج مطابقة للبحث"}
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-12 py-8 text-right text-xl font-bold text-gray-800 border-b-2 border-blue-200 w-1/3">
                        الاسم
                      </th>
                      <th className="px-12 py-8 text-right text-xl font-bold text-gray-800 border-b-2 border-blue-200 w-1/3">
                        الإدارة
                      </th>
                      <th className="px-12 py-8 text-right text-xl font-bold text-gray-800 border-b-2 border-blue-200 w-1/3">
                        إجراء
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((emp, index) => (
                      <tr
                        key={emp.id}
                        className={`group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="px-12 py-8 text-gray-900 font-semibold text-xl group-hover:text-blue-900 transition-colors duration-300">
                          <div className="flex items-center">
                            <div className="w-3 h-10 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {emp.name}
                          </div>
                        </td>
                        <td className="px-12 py-8 text-gray-900 font-semibold text-xl group-hover:text-blue-900 transition-colors duration-300">
                          {emp.administration}
                        </td>
                        <td className="px-12 py-8">
                          <Link
                            href={`/employees/employee/${emp.id}`}
                            className="group/link inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-purple-500 hover:to-blue-500"
                          >
                            <span>عرض التفاصيل</span>
                            <svg
                              className="mr-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}