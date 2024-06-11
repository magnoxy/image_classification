// components/Header.js
import Image from 'next/image';

const Header = () => {
  return (
    <header className="z-20 w-full xl:px-0 px-2">
      <div className="container mx-auto flex flex-wrap mt-8 mb-8">
        <div className="flex sm:w-1/2 flex items-center">
          <Image
            src="/MW.PNG" // Coloque o caminho para o seu arquivo de logo
            alt="My Company Logo"
            width={4000}
            height={4000}
          />
          <a href="/" className="text-2xl text-white ml-1 font-bold">My Company</a>
        </div>
        <div className="w-1/2 hidden sm:flex justify-end">
          <button className="border border-white bg-transparent text-white uppercase rounded-full py-2 px-4 hover:bg-blue-600">Get Started Now</button>
        </div>
      </div>
    </header>
  );
};

export default Header;