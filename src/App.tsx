import { useGameLogic } from './hooks/useGameLogic';
import StartScreen from './components/StartScreen';
import GameArea from './components/GameArea';
import GameResults from './components/GameResults';

function App() {
  const { gameState, startGame, catchObject, shareScore } = useGameLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-purple-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        

        {/* Game Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-red-500">
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
          <p>With great power comes great responsibility... or absolute corruption • Share your purge count!</p>
          <p className="mt-2">
            ⚡ How many will you banish today?
          </p>
          <div className="mt-4">
            <a 
              id="bolt-button" 
              href="https://bolt.new" 
              target="_blank" 
              title="Powered By Bolt"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm font-medium"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              Powered by Bolt
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;