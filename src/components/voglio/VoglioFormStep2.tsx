import { LinkIcon } from "@heroicons/react/24/solid";

export default function VoglioFormStep2({
  formData,
  sizeList,
  onFormChange,
}: {
  formData: any;
  sizeList: any[];
  onFormChange: (formData: any) => void;
}) {
  return (
    <div>
      {/* Notes */}
      <div className="mt-4">
        <label
          htmlFor="notes"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          onChange={(event) => {
            onFormChange({ ...formData, notes: event.target.value });
          }}
          value={formData.notes}
          className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:gray-indigo-600 sm:text-sm/6"
        />
      </div>

      <div className="mt-2 flex justify-evenly gap-6">
        {/* Size */}
        <div className="w-full">
          <label
            htmlFor="size"
            className="block text-sm font-medium text-gray-900"
          >
            Size
          </label>

          <select
            name="size"
            id="size"
            onChange={(event) =>
              onFormChange({ ...formData, sizeId: event.target.value })
            }
            className="mt-1.5 w-full px-3 py-1.5 border rounded-md border-gray-300 text-gray-700 focus:outline-2 focus:-outline-offset-2 focus:gray-indigo-600 sm:text-sm/6"
          >
            {sizeList.map((size) => (
              <option key={size.id} value={size.id}>
                {size.value}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div className="w-full">
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-900"
          >
            Quantity
          </label>

          <select
            name="quantity"
            id="quantity"
            onChange={(event) =>
              onFormChange({ ...formData, quantity: event.target.value })
            }
            className="mt-1.5 w-full px-3 py-1.5 border rounded-md border-gray-300 text-gray-700 focus:outline-2 focus:-outline-offset-2 focus:gray-indigo-600 sm:text-sm/6"
          >
            {sizeList.map((size) => (
              <option key={size.id} value={size.id}>
                {size.value}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Reference link */}
      <div className="mt-2 relative">
        <label
          htmlFor="referenceLink"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Reference link
        </label>
        <input
          id="referenceLink"
          name="referenceLink"
          type="text"
          onChange={(event) => {
            onFormChange({ ...formData, referenceLink: event.target.value });
          }}
          value={formData.referenceLink}
          className="mt-2 w-full rounded-md bg-white px-3 py-1.5 pr-10 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:gray-indigo-600 sm:text-sm/6"
        />
        <span className="absolute inset-y-0  top-8 end-3 grid place-content-center">
          <LinkIcon className="size-4 text-gray-300" />
        </span>
      </div>
    </div>
  );
}
