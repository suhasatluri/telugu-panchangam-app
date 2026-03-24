import AncestorReminder from "@/components/AncestorReminder";

export default function RemindersPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-noto-telugu text-3xl text-accent mb-2">
          పితృ స్మరణ
        </h1>
        <p className="font-playfair italic text-text-secondary text-lg mb-4">
          Ancestor Remembrance
        </p>
        <div className="w-16 h-px bg-accent mx-auto mb-6" />
        <p className="font-lora text-text-secondary max-w-md mx-auto leading-relaxed">
          Honour those who came before you. Set a reminder for Amavasya and
          other sacred Tithis — we will send you a personal email so you
          never miss a moment to pay respects.
        </p>
      </div>
      <AncestorReminder />
    </main>
  );
}
