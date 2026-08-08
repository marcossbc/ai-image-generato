import { FaWandMagicSparkles } from "react-icons/fa6";


const Header = () => {
  return (
    <header className="flex gap-3 items-center mb-6">
      <div
        className="h-11 w-11 text-white flex items-center justify-center rounded-lg"
        style={{ background: "var(--color-gradient)" }}
      >
        <FaWandMagicSparkles size={22} />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold">AI Image Generator</h1>
    </header>
  );
};

export default Header;