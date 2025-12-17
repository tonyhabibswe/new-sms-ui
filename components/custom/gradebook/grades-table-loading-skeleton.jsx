'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function GradesTableLoadingSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Sticky student columns */}
              <TableHead className="sticky left-0 z-20 bg-background border-r">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="sticky left-[100px] z-20 bg-background border-r">
                <Skeleton className="h-4 w-32" />
              </TableHead>
              {/* Grade columns */}
              {[...Array(6)].map((_, i) => (
                <TableHead key={i} className="text-center">
                  <Skeleton className="h-4 w-20 mx-auto mb-1" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </TableHead>
              ))}
              {/* Calculated columns */}
              <TableHead className="text-center bg-accent">
                <Skeleton className="h-4 w-24 mx-auto" />
              </TableHead>
              <TableHead className="text-center bg-accent">
                <Skeleton className="h-4 w-24 mx-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(10)].map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {/* Student ID */}
                <TableCell className="sticky left-0 z-10 bg-background border-r">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                {/* Student Name */}
                <TableCell className="sticky left-[100px] z-10 bg-background border-r">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                {/* Grade cells */}
                {[...Array(6)].map((_, cellIndex) => (
                  <TableCell key={cellIndex} className="text-center">
                    <Skeleton className="h-4 w-12 mx-auto" />
                  </TableCell>
                ))}
                {/* Calculated cells */}
                <TableCell className="text-center bg-accent/20">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </TableCell>
                <TableCell className="text-center bg-accent/20">
                  <Skeleton className="h-4 w-8 mx-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
