import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="grid h-screen place-content-center bg-[#F8F7FC] px-4">
      <div className="text-center">
        <h1 className="font-display text-6xl text-[#1B1B2D]">404</h1>
        <p className="mt-2 text-sm text-[#6B6E85]">{t("notFound.pageNotFound")}</p>
      </div>
    </div>
  );
}
