export default function Voglio(props: { name: string; notes: string; imageSrc: string}) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img
        className="w-full"
        src={props.imageSrc}
        alt={props.name}
      />
      <div className="px-6 py-4">
        <h3 className="font-bold text-xl mb-2">{props.name}</h3>
        <p className="text-gray-700 text-base">{props.notes}</p>
      </div>
    </div>
  );
}
