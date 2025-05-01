import { LoaderPinwheel } from "lucide-react";

interface Props {
  fullPage?: boolean;
}

const Loader = ({ fullPage }: Props) => {
  return (
    <>
      {fullPage ? (
        <div className="h-screen bg-primary-400 flex justify-center items-center w-full">
          <LoaderPinwheel className="w-24 h-24 animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <LoaderPinwheel className="w-24 h-24 animate-spin text-white" />
        </div>
      )}
    </>
  );
};

export default Loader;
