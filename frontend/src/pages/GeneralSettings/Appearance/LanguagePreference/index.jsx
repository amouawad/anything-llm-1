import { useLanguageOptions } from "@/hooks/useLanguageOptions";

export default function LanguagePreference() {
  const {
    currentLanguage,
    supportedLanguages,
    getLanguageName,
    changeLanguage,
  } = useLanguageOptions();

  return (
    <>
      <div className="flex flex-col gap-y-1">
        <h2 className="text-base leading-6 font-bold text-forest">
          Display Language
        </h2>
        <p className="text-xs leading-[18px] font-base text-forest/60">
          Select the preferred language to render AnythingLLM's UI in, when
          applicable.
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        <select
          name="userLang"
          className="bg-dark-highlight w-fit mt-2 px-4 border-gray-500 text-white text-sm rounded-lg block py-2"
          defaultValue={currentLanguage || "en"}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          {supportedLanguages.map((lang) => {
            return (
              <option key={lang} value={lang}>
                {getLanguageName(lang)}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
}
