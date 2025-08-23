"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EmployeesTable } from "@/components/employees-table";
import Link from "next/link";
import { Employee } from "@/types";
import { ADMINISTRATIONS_AND_REGIONS } from "@/src/constants/groups";
import { getEmployees } from "@/lib/actions/employee.actions";

const toArabicDigits = (num: number) => {
  return num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
};

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [name, setName] = useState("");
  const [administration, setAdministration] = useState("");
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch initial employees data
  useEffect(() => {
    const fetchInitialEmployees = async () => {
      try {
        const employeesData = await getEmployees();
        const formattedEmployees: Employee[] = (employeesData?.employees ?? []).map(
          (emp: any) => ({
            ...emp,
            birthDate:
              emp.birthDate instanceof Date
                ? emp.birthDate.toISOString()
                : emp.birthDate,
            hiringDate:
              emp.hiringDate instanceof Date
                ? emp.hiringDate.toISOString()
                : emp.hiringDate,
            createdAt:
              emp.createdAt instanceof Date
                ? emp.createdAt.toISOString()
                : emp.createdAt,
            updatedAt:
              emp.updatedAt instanceof Date
                ? emp.updatedAt.toISOString()
                : emp.updatedAt,
          })
        );
        setEmployees(formattedEmployees);
      } catch (error) {
        console.error("Error fetching initial employees:", error);
        setEmployees([]);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialEmployees();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name && !administration) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setIsSearching(true);

    try {
      const res = await fetch(
        `/api/employees/search?name=${encodeURIComponent(name)}&administration=${encodeURIComponent(administration)}`
      );
      const data = await res.json();

      if (data.success) {
        setSearchResults(data.employees);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-blue-600 font-bold text-xl animate-pulse">
          جاري تحميل البيانات...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* ... Rest of your JSX remains the same ... */}
      <div className="relative z-10 w-full max-w-none px-6 lg:px-12 xl:px-16 py-12 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
            إدارة الموظفين
          </h1>
          <p className="text-xl text-gray-600 font-semibold max-w-2xl mx-auto">
            نظام شامل لإدارة وعرض بيانات الموظفين في جهاز تعمير سيناء
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
        </div>

        {/* Stats and Actions Bar */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-4">
                  <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                  </svg>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {toArabicDigits(employees.length)}
                </div>
                <p className="text-xl text-gray-600 font-semibold">إجمالي الموظفين المسجلين</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/employees/create">
                <Button className="group relative px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center">
                    <svg className="w-6 h-6 ml-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                    </svg>
                    إضافة موظف جديد
                  </span>
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="group px-10 py-5 text-xl font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-2xl hover:border-blue-400 hover:text-blue-600 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="flex items-center">
                    <svg className="w-6 h-6 ml-3 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                    </svg>
                    العودة للرئيسية
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Employees Table */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 px-12 py-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <h2 className="text-3xl font-bold text-white mr-4">
                  قائمة الموظفين التفصيلية
                </h2>
              </div>
            </div>
          </div>
          <div className="p-8">
            <EmployeesTable employees={isSearching ? searchResults : employees} />
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center justify-center space-x-2 space-x-reverse text-gray-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-lg">النظام يعمل بحالة ممتازة</span>
          </div>
          <p className="text-gray-500">
            آخر تحديث: {new Date().toLocaleDateString('ar-EG')} - {new Date().toLocaleTimeString('ar-EG')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;