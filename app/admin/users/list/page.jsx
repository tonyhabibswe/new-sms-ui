import { promises as fs } from 'fs'
import path from 'path'

import { columns } from '@/components/custom/data-table/columns'
import { DataTable } from '@/components/custom/data-table/data-table'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

export const metadata = {
  title: 'Tasks',
  description: 'A task and issue tracker build using Tanstack Table.'
}
export const revalidate = 0;
// // Simulate a database read for tasks.
// async function getTasks() {
//   const data = await fs.readFile(
//     path.join(process.cwd(), '/components/custom/data-table/data/tasks.json')
//   )

//   const tasks = JSON.parse(data.toString())
//   return tasks
// }

export default async function TaskPage() {
  // const tasks = await getTasks()

  return (
    <></>
    // <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
    //   <div className="flex items-center">
    //     <h2 className="text-2xl font-bold tracking-tight">Users List</h2>
    //     <TooltipProvider>
    //       <Tooltip>
    //         <TooltipTrigger asChild>
    //           <Button
    //             variant="ghost"
    //             className="ml-1 px-2 hover:bg-transparent">
    //             <PlusCircledIcon className="w-6 h-6" />
    //           </Button>
    //         </TooltipTrigger>
    //         <TooltipContent>Add User</TooltipContent>
    //       </Tooltip>
    //     </TooltipProvider>
    //   </div>
    //   <DataTable data={tasks} columns={columns} />
    // </div>
  )
}
