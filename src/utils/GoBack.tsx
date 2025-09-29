import { ArrowLeft } from "../icons";
import useGoBack from "../hooks/useGoBack";
const GoBackButton = () => {
  const goBack = useGoBack();

  return (
    <div>
      <button
        onClick={goBack}
        className="p-2 mb-4 text-white bg-gray-200 rounded-full shadow-md hover:bg-gray-300"
      >
            <ArrowLeft  className="w-4 h-4" />
      </button>
    </div>
  );
};

export default GoBackButton;
