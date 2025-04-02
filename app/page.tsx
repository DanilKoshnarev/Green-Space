import Scene3D from '../src/components/Scene3D';

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0">
        <Scene3D />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-transparent via-black/50 to-black/70">
        <h1 className="text-6xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Welcome to Green Space
        </h1>
        <p className="text-xl text-center max-w-2xl mb-8 text-gray-300">
          Experience the future of web development with our interactive 3D environment
        </p>
        <div className="flex gap-6">
          <button className="px-8 py-3 rounded-full bg-cyan-500 hover:bg-cyan-600 transition-colors text-white font-semibold">
            Explore
          </button>
          <button className="px-8 py-3 rounded-full border-2 border-cyan-500 hover:bg-cyan-500/20 transition-colors text-white font-semibold">
            Learn More
          </button>
        </div>
      </div>
    </main>
  );
}
