export default function CategoryPreview({
  name,
  vogliosCount,
  emojiCode,
}: {
  name: string;
  vogliosCount: number;
  emojiCode: string;
}) {
  return (
    <div className="h-[160px] max-w border rounded-md overflow-hidden shadow-lg">
      <div className="text-center">
        <p className="py-4 bg-gray-100 text-6xl">
          <span>{emojiCode}</span>
        </p>
        <h3 className="mt-2 font-bold text-md">{name}</h3>
        <p className="mt-2 text-xs text-gray-400">{vogliosCount} voglios</p>
      </div>
    </div>
  );
}
