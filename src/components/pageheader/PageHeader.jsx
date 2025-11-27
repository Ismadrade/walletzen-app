import { useLocation } from "react-router-dom";
import { pageTitles } from "../../config/pageTitles"

export default function PageHeader() {
  const location = useLocation();

  const title = pageTitles[location.pathname] || "Página";
  return (
    <div className="w-full border-b-2 border-gray-300 dark:border-gray-700">
    <div className="flex gap-8 relative">
        <button
        className={`
            pb-4 relative
            text-2xl text-gray-700 dark:text-gray-200 font-bold
        `}
        >
        {title}
        {/* underline grosso do ativo */}
        <span className="
            absolute left-0 -bottom-[1px] w-[130%] h-[10px]
            bg-indigo-500 dark:bg-indigo-400
        "></span>
        </button>
    </div>
    </div>
  );
}
