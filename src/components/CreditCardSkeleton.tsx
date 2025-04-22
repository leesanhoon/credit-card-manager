export default function CreditCardSkeleton() {
  return (
    <div className="border rounded-xl bg-white shadow-sm overflow-hidden animate-pulse">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-6 w-32 bg-gray-200 rounded animate-skeleton"></div>
          </div>
          <div className="h-6 w-24 bg-gray-200 rounded-full animate-skeleton"></div>
        </div>

        <div className="ml-9 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-skeleton"></div>
            <div className="h-5 w-40 bg-gray-200 rounded animate-skeleton"></div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-5 w-28 bg-gray-200 rounded animate-skeleton"></div>
              <div className="h-5 w-24 bg-gray-200 rounded animate-skeleton"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-5 w-32 bg-gray-200 rounded animate-skeleton"></div>
              <div className="h-5 w-24 bg-gray-200 rounded animate-skeleton"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-5 w-28 bg-gray-200 rounded animate-skeleton"></div>
              <div className="h-5 w-24 bg-gray-200 rounded animate-skeleton"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t flex justify-end space-x-3">
        <div className="h-9 w-20 bg-gray-200 rounded-lg animate-skeleton"></div>
        <div className="h-9 w-16 bg-gray-200 rounded-lg animate-skeleton"></div>
      </div>
    </div>
  )
}