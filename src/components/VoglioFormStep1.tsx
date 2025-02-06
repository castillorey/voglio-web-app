import { ICategory, ISize } from "./VoglioForm";

export default function VoglioFormStep1({
  formData,
  categoryList,
  onFormChange,
}: {
  formData: any;
  categoryList: ICategory[];
  sizeList: ISize[];
  onFormChange: (formData: any) => void;
}) {
  return (
    <div>
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={(event) => {
            onFormChange({ ...formData, name: event.target.value });
          }}
          value={formData.name}
          className="mt-2 w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:gray-indigo-600 sm:text-sm/6"
        />
      </div>
      {/* Category */}
      <div className="mt-4">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-900"
        >
          Category
        </label>

        <select
          name="category"
          id="category"
          onChange={(event) =>
            onFormChange({ ...formData, categoryId: event.target.value })
          }
          className="mt-1.5 w-full px-3 py-1.5 border rounded-md border-gray-300 text-gray-700 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-sm/6"
        >
          {categoryList.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
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
        <p className="mt-2 text-sm/6 text-gray-600">
          Write something that helps looking for this item.
        </p>
      </div>
    </div>
  );
}
