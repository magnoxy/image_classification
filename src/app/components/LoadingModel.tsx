import Image from "next/image";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-sky-500 to-indigo-500 bg-opacity-75">
      <div className="relative">
        <div className="absolute animate-spin rounded-full border-gradient border-8 border-t-transparent h-full w-full"></div>
        <div className="relative z-10">
          <Image
            src="/MW.png" // Ajuste o caminho conforme necessário
            alt="MW Logo"
            width={200} // Ajuste o tamanho do logo conforme necessário
            height={200} // Ajuste o tamanho do logo conforme necessário
          />
        </div>
      </div>
    </div>
  );
};

export default Loading;