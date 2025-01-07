import { useTranslation } from "react-i18next";

export default function WorkspaceDefault({ isDefault, handleChange, saving }) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="isDefault" className="block input-label">
          {t("common.workspaces-default")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {t("general.default.description")}
        </p>
      </div>
      <div className="mt-2">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            id="isDefault"
            type="checkbox"
            name="isDefault"
            value="yes"
            checked={isDefault}
            onChange={handleChange}
            disabled={saving}
            className="peer sr-only"
          />
          <div className="pointer-events-none peer h-6 w-11 rounded-full bg-stone-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border after:border-gray-600 after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-lime-300 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800"></div>
        </label>
      </div>
    </div>
  );
}
