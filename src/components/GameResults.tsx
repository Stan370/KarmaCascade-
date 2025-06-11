import React from 'react';
import { Trophy, Share, RotateCcw, Star, MessageCircle } from 'lucide-react';

interface GameResultsProps {
  score: number;
  highScore: number;
  combo: number;
  postKarma: number;
  onRestart: () => void;
  onShare: () => void;
}

const GameResults: React.FC<GameResultsProps> = ({ 
  score, 
  highScore, 
  combo, 
  postKarma,
  onRestart, 
  onShare 
}) => {
  const getModRank = (score: number) => {
    if (score >= 100) return { rank: "Reddit Legend", color: "text-purple-600", message: "You could moderate r/all!" };
    if (score >= 75) return { rank: "Super Moderator", color: "text-yellow-600", message: "The admins want to hire you!" };
    if (score >= 50) return { rank: "Good Moderator", color: "text-green-600", message: "Your subreddit is lucky to have you!" };
    if (score >= 25) return { rank: "Learning Mod", color: "text-blue-600", message: "Getting the hang of this!" };
    if (score >= 10) return { rank: "Rookie Mod", color: "text-orange-600", message: "Not bad for a newbie!" };
    return { rank: "Chaos Creator", color: "text-red-600", message: "Maybe stick to lurking..." };
  };

  const getFailureMessage = () => {
    const messages = [
      "Your comment section turned into the Wild West faster than r/wallstreetbets during GameStop!",
      "You let more trolls through than a bridge in a fairy tale!",
      "You approved 'First!' comments... the Reddit gods are disappointed!",
      "Your post got locked faster than a political thread in r/pics!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const modRank = getModRank(score);
  const isNewHighScore = score > highScore && highScore > 0;

  return (
    <div className="text-center space-y-6">
      {/* Score Display */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-4 border-orange-500">
        {isNewHighScore && (
          <div className="flex items-center justify-center gap-2 mb-4 text-yellow-600">
            <Star className="w-6 h-6 animate-spin" />
            <span className="font-bold text-lg">NEW PERSONAL BEST!</span>
            <Star className="w-6 h-6 animate-spin" />
          </div>
        )}
        
        <div className="text-4xl font-bold text-gray-800 mb-2">
          {score}
        </div>
        <div className="text-lg text-gray-600 mb-4">Comments Moderated</div>
        
        <div className={`text-xl font-bold ${modRank.color} mb-2`}>
          {modRank.rank}
        </div>
        <div className="text-sm text-gray-600 mb-4">
          {modRank.message}
        </div>

        {combo > 1 && (
          <div className="bg-orange-100 rounded-lg p-3 mb-4">
            <div className="text-sm text-orange-800">
              Best Moderation Streak: <span className="font-bold">x{combo}</span>
            </div>
          </div>
        )}

        {score < 25 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="text-sm text-red-700 italic">
              {getFailureMessage()}
            </div>
          </div>
        )}
      </div>

      {/* Post Performance */}
      <div className="bg-gradient-to-r from-orange-100 to-blue-100 rounded-xl p-4 border-2 border-dashed border-orange-300">
        <div className="text-lg font-bold text-gray-800 mb-2">
          📊 Your Post's Final Stats
        </div>
        <div className="text-sm text-gray-700 space-y-1">
          <div>• Final Karma: {postKarma.toLocaleString()} upvotes</div>
          <div>• Comments Handled: {score}</div>
          <div>• Longest Streak: x{combo}</div>
          <div>• Mod Status: {modRank.rank}</div>
          <div>• Trolls Banned: {Math.floor(score / 3)}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
        >
          <RotateCcw className="w-5 h-5" />
          Post Again
        </button>
        
        <button
          onClick={onShare}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
        >
          <Share className="w-5 h-5" />
          Share Results
        </button>
      </div>

      {/* High Score */}
      {highScore > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Trophy className="w-4 h-4" />
          Personal Best: {highScore} comments moderated
        </div>
      )}
    </div>
  );
};

export default GameResults;