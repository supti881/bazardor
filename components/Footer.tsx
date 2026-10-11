export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200/80 py-6 font-sans">
      <div className="container mx-auto max-w-7xl px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-black font-medium">
        <div>
          <span className="font-bold text-black">বাজার দর</span> — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </div>
        <div>
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </div>
      </div>
    </footer>
  );
}