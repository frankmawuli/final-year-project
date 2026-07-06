export function ProfileCompletionCard({ percent }: { percent: number }) {
  return (
    <div className="rounded-xl bg-[#1F2A3C] text-white px-5 py-6 text-center">
      <p className="text-3xl font-bold">{percent}%</p>
      <p className="mt-2 text-[12.5px] leading-relaxed text-white/80">
        A complete profile helps you stand out to employers. Let&apos;s make your profile shine ✨
        Upload your CV and we&apos;ll do the heavy lifting
      </p>
    </div>
  );
}
