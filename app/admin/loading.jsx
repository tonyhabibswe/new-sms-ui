import { Skeleton } from '@/components/ui/skeleton'

const Loading = () => {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center">
        <Skeleton className="text-2xl font-bold tracking-tight" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <Skeleton className="h-8 w-[150px] lg:w-[250px]" />
          </div>
        </div>
        <Skeleton className="w-[70vw] h-[60vh]" />
      </div>
    </div>
  )
}

export default Loading
