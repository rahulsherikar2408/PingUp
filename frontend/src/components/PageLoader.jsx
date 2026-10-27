import { LoaderIcon } from "lucide-react";
import { APP_NAME, AppLogo } from "./AppLogo";
import { useWallpaper } from "../context/wallpaper";

const PageLoader = () => {
  const { frameStyle } = useWallpaper();

  return (
    <div
      className="flex h-dvh items-center justify-center p-3 sm:p-5 md:p-8"
      style={frameStyle}
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-background/95 px-8 py-6 text-foreground shadow-2xl backdrop-blur-md">
        <AppLogo size={48} className="rounded-xl shadow-md" />

        <div className="flex items-center gap-2.5 text-sm font-medium text-muted">
          <LoaderIcon className="size-4.5 animate-spin text-accent" aria-hidden />
          <span>Loading {APP_NAME}...</span>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
