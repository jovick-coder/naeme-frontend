import Image from "next/image";

export default function Spinner({ className, height, width }) {
  return (
    <Image
      className={`self-center cursor-pointer animate-spin text-green-500 ${className}`}
      src="/spinner.png"
      alt="spinner"
      height={height ? height : 30}
      width={width ? width : 30}
    />
  );
}
