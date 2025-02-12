export default function CategoryPreview({name, description, emojiCode} : {
  name: string;
  description: string;
  emojiCode: string;
}) {
  return (
    <div className="h-60 max-w border rounded-md overflow-hidden shadow-lg">
      <p className="py-5 text-center text-6xl bg-gray-100"><span>{emojiCode}</span></p>
      <div className="px-6 py-4">
        <h3 className="font-bold text-xl mb-2">{name}</h3>
        <p className="py-5 text-gray-700 text-base">{description}</p>
      </div>
    </div>
  );
}
