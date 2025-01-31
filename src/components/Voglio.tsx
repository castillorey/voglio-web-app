export default function Voglio(props: { name: string; description: string; }) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img
        className="w-full"
        src="src/assets/img/mountain.jpg"
        alt="Sunset in the mountains"
      />
      <div className="px-6 py-4">
        <h3 className="font-bold text-xl mb-2">{props.name}</h3>
        <p className="text-gray-700 text-base">{props.description}</p>
      </div>
    </div>
  );
}
