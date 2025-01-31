export default function VoglioFormStep1() {
  return (
    <div className="border-b border-gray-900/10 pb-12">
      <div className="sm:col-span-4">
        <label
          htmlFor="username"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Name
        </label>
        <input
          id="username"
          name="username"
          type="text"
          className="mt-2 w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
        />
      </div>

      <div className="mt-4 col-span-full">
        <label
          htmlFor="about"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Notes
        </label>
        <textarea
            id="about"
            name="about"
            rows={2}
            className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            defaultValue={""}
          />
        <p className="mt-2 text-sm/6 text-gray-600">
          Write something that helps looking for this item.
        </p>
      </div>
    </div>
  );
}
