import { useGameLogic } from './hooks/useGameLogic';
import StartScreen from './components/StartScreen';
import GameArea from './components/GameArea';
import GameResults from './components/GameResults';

function App() {
  const { gameState, startGame, catchObject, shareScore } = useGameLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-blue-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">📱</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Reddit Post Panic
            </h1>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">💬</span>
            </div>
          </div>
          <p className="text-gray-600">
            Your post just hit r/all... can you survive the comment chaos?
          </p>
        </div>

        {/* Game Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-orange-500">
          {gameState.gameStatus === 'waiting' && (
            <StartScreen 
              onStart={startGame} 
              highScore={gameState.highScore}
            />
          )}

          {gameState.gameStatus === 'playing' && (
            <GameArea
              gameObjects={gameState.gameObjects}
              onCatch={catchObject}
              timeLeft={gameState.timeLeft}
              score={gameState.score}
              combo={gameState.combo}
              powerUps={gameState.powerUps}
              postKarma={gameState.postKarma}
            />
          )}

          {gameState.gameStatus === 'ended' && (
            <GameResults
              score={gameState.score}
              highScore={gameState.highScore}
              combo={gameState.combo}
              postKarma={gameState.postKarma}
              onRestart={startGame}
              onShare={shareScore}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Every Redditor's dream and nightmare combined • Share your moderation skills!</p>
          <p className="mt-2">
            🏆 Think you can handle r/all? Prove it!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;