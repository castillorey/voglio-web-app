export default function VoglioPreview({
  name,
  imageUrl,
  notes,
}: {
  name: string;
  imageUrl: string;
  notes: string;
}) {
  return (
    <div className="flex items-stretch gap-4">
      <img
        src={imageUrl}
        alt=""
        className="aspect-square w-20 rounded-lg object-cover"
      />
      <div className="w-full">
        <h3 className="text-lg/tight font-medium text-gray-900">
          {name}
        </h3>
        <p className="mt-0.5 h-20 text-gray-700 overflow-ellipsis overflow-hidden">
            {notes}
        </p>
      </div>
    </div>
  );
}
