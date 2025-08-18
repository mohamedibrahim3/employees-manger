'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ComponentType<any>
}

const Breadcrumb = () => {
  const pathname = usePathname()
  
  // Generate breadcrumb items based on pathname
  const pathSegments = pathname.split('/').filter(segment => segment !== '')
  
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'الرئيسية', href: '/', icon: Home }
  ]

  // Map path segments to Arabic labels
  const segmentLabels: { [key: string]: string } = {
    'employees': 'الموظفين',
    'create': 'إضافة موظف جديد',
    'edit': 'تعديل موظف'
  }

  pathSegments.forEach((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    const label = segmentLabels[segment] || segment
    breadcrumbItems.push({ label, href })
  })

  if (breadcrumbItems.length <= 1) return null

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && (
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          )}
          {index === breadcrumbItems.length - 1 ? (
            <span className="text-gray-900 font-medium flex items-center space-x-1">
              {index === 0 && item.icon && <item.icon className="w-4 h-4" />}
              <span>{item.label}</span>
            </span>
          ) : (
            <Link 
              href={item.href}
              className="hover:text-blue-600 transition-colors flex items-center space-x-1"
            >
              {index === 0 && item.icon && <item.icon className="w-4 h-4" />}
              <span>{item.label}</span>
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumb
