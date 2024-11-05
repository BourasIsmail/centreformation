'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { HomeIcon } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// This object maps path segments to display names
const breadcrumbNameMap: { [key: string]: string } = {
  '/formations': 'Formations',
  '/instructeurs': 'Instructeurs',
  '/etudiants': 'Étudiants',
  '/contact': 'Contact',
  // Add more mappings as needed
}

export function DynamicBreadcrumbComponent() {
  const pathname = usePathname()
  const pathnames = pathname.split('/').filter((x) => x)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <HomeIcon className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
          const isLast = index === pathnames.length - 1

          return (
            <BreadcrumbItem key={routeTo}>
              {!isLast ? (
                <>
                  <BreadcrumbLink href={routeTo}>
                    {breadcrumbNameMap[routeTo] || name}
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbPage>{breadcrumbNameMap[routeTo] || name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}