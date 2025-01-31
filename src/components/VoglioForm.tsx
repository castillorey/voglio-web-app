import { useState } from "react";
import VoglioFormStep1 from "./VoglioFormStep1";
import VoglioFormStep2 from "./VoglioFormStep2";

export default function Example() {
  const [step, setStep] = useState(1);
  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step > 1 ? step - 1 : 1);
  return (
    <form>
        {step === 1 && <VoglioFormStep1 />}
        {step === 2 && <VoglioFormStep2 />}
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button 
        type="button" 
        onClick={handlePrevStep} 
        className="text-sm/6 font-semibold text-gray-900">
          Previous
        </button>
        <button
          type="button"
          onClick={handleNextStep}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Next
        </button>
      </div>
    </form>
  );
}
