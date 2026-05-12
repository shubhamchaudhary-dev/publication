export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-xl p-5 flex flex-col gap-3 animate-pulse">
      <div className="h-5 w-20 bg-[#E2E8F0] dark:bg-[#1F2937] rounded-full" />
      <div className="h-5 bg-[#E2E8F0] dark:bg-[#1F2937] rounded w-3/4" />
      <div className="h-4 bg-[#E2E8F0] dark:bg-[#1F2937] rounded w-1/2" />
      <div className="h-4 bg-[#E2E8F0] dark:bg-[#1F2937] rounded" />
      <div className="h-4 bg-[#E2E8F0] dark:bg-[#1F2937] rounded w-5/6" />
      <div className="flex justify-between mt-2 pt-3 border-t border-[#E2E8F0] dark:border-[#1F2937]">
        <div className="h-4 w-16 bg-[#E2E8F0] dark:bg-[#1F2937] rounded" />
        <div className="h-7 w-16 bg-[#E2E8F0] dark:bg-[#1F2937] rounded-lg" />
      </div>
    </div>
  );
}
