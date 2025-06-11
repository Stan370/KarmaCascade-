import React from 'react';
import { Play, Trophy, MessageCircle, ArrowUp, Award } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  return (
    <div className="text-center space-y-6">
      {/* Game Title */}
      <div className="space-y-4">
        <div className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
          Reddit Post Panic
        </div>
        <div className="text-lg text-gray-600">
          Your post just hit the front page... can you handle the chaos?
        </div>
      </div>

      {/* Scenario Setup */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-4 border-orange-500">
        <div className="text-xl font-bold text-gray-800 mb-4">
          📱 The Situation
        </div>
        <div className="text-gray-700 mb-4 italic">
          "Holy sh*t! Your meme just hit r/all and notifications are going CRAZY! 
          Comments are flooding in faster than you can read them. Quick - approve the good ones, 
          delete the trolls, and don't let the mods catch you slipping!"
        </div>
        
        <div className="space-y-3 text-left text-gray-700">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-green-500" />
            <span><strong>Click good comments</strong> - "This is hilarious!" "Take my upvote!"</span>
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-red-500" />
            <span><strong>Delete bad comments</strong> - Trolls, spam, and rule violations</span>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-yellow-500" />
            <span><strong>Catch awards</strong> - Someone's giving you Gold!</span>
          </div>
          <div className="flex items-center gap-3">
            <ArrowUp className="w-6 h-6 text-orange-500" />
            <span><strong>Watch your karma</strong> - Bad moderation = downvotes!</span>
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border-2 border-dashed border-blue-300">
        <div className="text-lg font-bold text-gray-800 mb-3">
          💬 What You'll See
        </div>
        <div className="space-y-2 text-sm">
          <div className="bg-green-100 p-2 rounded border-l-4 border-green-500">
            <strong>Good:</strong> "LMAO this made my day! 😂"
          </div>
          <div className="bg-red-100 p-2 rounded border-l-4 border-red-500">
            <strong>Bad:</strong> "This is stupid and you're an idiot"
          </div>
          <div className="bg-yellow-100 p-2 rounded border-l-4 border-yellow-500">
            <strong>Tricky:</strong> "First!" (Low effort - delete it!)
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto"
      >
        <Play className="w-6 h-6" />
        Handle the Chaos!
      </button>

      {/* High Score */}
      {highScore > 0 && (
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold">Best Karma Gained: {highScore.toLocaleString()}</span>
        </div>
      )}

      {/* Reddit Flavor Text */}
      <div className="text-sm text-gray-500 italic">
        "Every Redditor's nightmare... and dream come true!" - r/memes
      </div>
    </div>
  );
};

export default StartScreen;