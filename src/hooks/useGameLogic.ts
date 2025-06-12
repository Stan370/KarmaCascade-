import { useState, useEffect, useCallback } from 'react';
import { GameState, GameObject } from '../types/game';

const GAME_DURATION = 30; // seconds

const COMMENT_TEMPLATES = {
  good: [
    "This is hilarious! 😂",
    "Take my upvote!",
    "LMAO this made my day",
    "Quality content right here",
    "This deserves gold!",
    "Saving this post",
    "Best meme I've seen today",
    "You win the internet today"
  ],
  bad: [
    "This is stupid and you're dumb",
    "Cringe af delete this",
    "Nobody asked",
    "This isn't funny",
    "Reported for spam",
    "You're what's wrong with Reddit",
    "Downvoted and blocked",
    "Kill yourself"
  ],helpful: [
    "Actually, the source is [link]!", "Great explanation, thanks!", "This helped me a lot!",
    "TIL something new!", "OP, you might want to check this:", "Fantastic point!", "Very insightful."
  ],
  tricky: [ // These are often considered low-effort and removed
    "First!", "This.", "Came here to say this",
    "Underrated comment", "Edit: Thanks for the gold, kind stranger!", "Username checks out"
  ],spam: [
    "Check out my new crypto coin!", "FREE V-BUCKS HERE -> [dodgy.link]", "My onlyfans is better",
    "Subscribe to my channel!", "!!!!!! CLICK HERE !!!!!!", "Nice post, visit my profile for more"
  ]
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    combo: 0,
    timeLeft: GAME_DURATION,
    gameObjects: [],
    powerUps: {
      modProtection: false,
      cakeDay: 0
    },
    gameStatus: 'waiting',
    highScore: parseInt(localStorage.getItem('redditModHighScore') || '0'),
    postKarma: 1
  });

  // Game loop for moving objects and spawning new ones
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    const gameLoop = setInterval(() => {
      setGameState(prev => {
        // Move objects down
        const updatedObjects = prev.gameObjects
          .map(obj => ({ ...obj, y: obj.y + obj.speed }))
          .filter(obj => obj.y < 110); // Remove objects that fell off screen

        // Spawn new objects
        const shouldSpawn = Math.random() < 0.4;
        let newObjects = [...updatedObjects];
        
        if (shouldSpawn) {
          const newObject = createRandomComment();
          newObjects.push(newObject);
        }

        // Auto-moderate during cake day
        if (prev.powerUps.cakeDay > 0) {
          newObjects = newObjects.map(obj => {
            if (['good-comment', 'gold-award'].includes(obj.type) && !obj.caught) {
              return { ...obj, caught: true };
            }
            return obj;
          });
        }

        return {
          ...prev,
          gameObjects: newObjects
        };
      });
    }, 80);

    return () => clearInterval(gameLoop);
  }, [gameState.gameStatus]);

  // Timer countdown
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = prev.timeLeft - 1;
        if (newTimeLeft <= 0) {
          return { ...prev, timeLeft: 0, gameStatus: 'ended' };
        }
        return { 
          ...prev, 
          timeLeft: newTimeLeft,
          powerUps: {
            ...prev.powerUps,
            cakeDay: Math.max(0, prev.powerUps.cakeDay - 1)
          }
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameStatus]);

  // Save high score based on postKarma instead of score
  useEffect(() => {
    if (gameState.gameStatus === 'ended' && gameState.postKarma > gameState.highScore) {
      localStorage.setItem('redditModHighScore', gameState.postKarma.toString());
      setGameState(prev => ({ ...prev, highScore: gameState.postKarma }));
    }
  }, [gameState.gameStatus, gameState.postKarma, gameState.highScore]);

  const createRandomComment = (): GameObject => {
    const types: GameObject['type'][] = [
      'good-comment', 'good-comment', 'good-comment', 'good-comment',
      'helpful-comment', 'helpful-comment',
      'bad-comment', 'bad-comment', 'bad-comment',
      'spam-bot', 'spam-bot',
      'repost',
      'gold-award',
      'mod-warning',
      'cake-day',
      'rickroll'
    ];
    
    const type = types[Math.floor(Math.random() * types.length)];
    
    let text = '';
    let points = 0;
    let username = '';

    
    switch (type) {
      case 'good-comment':
        text = COMMENT_TEMPLATES.good[Math.floor(Math.random() * COMMENT_TEMPLATES.good.length)];
        points = -5; // Click to approve
        username = `u/PosiVibes${Math.floor(Math.random()*100)}`;
        break;
      case 'helpful-comment':
        text = COMMENT_TEMPLATES.helpful[Math.floor(Math.random() * COMMENT_TEMPLATES.helpful.length)];
        points = -10; // Click to approve, more valuable
        username = `u/SmartyPants${Math.floor(Math.random()*100)}`;
        break;
      case 'bad-comment':
        text = COMMENT_TEMPLATES.bad[Math.floor(Math.random() * COMMENT_TEMPLATES.bad.length)];
        points = 10; // Click to DELETE (positive points for correct action)
        username = `u/AngryTroll${Math.floor(Math.random()*100)}`;
        break;
      case 'spam-bot':
        text = COMMENT_TEMPLATES.spam[Math.floor(Math.random() * COMMENT_TEMPLATES.spam.length)];
        points = 7; // Click to DELETE (positive points)
        username = `u/SpamBot${Math.floor(Math.random()*1000)}`;
        break;
      case 'repost':
        text = "I've seen this before... pretty sure it's a repost.";
        points = 3; // Click to DELETE (low effort)
        username = `u/ReposterPatrol${Math.floor(Math.random()*100)}`;
        break;
      case 'gold-award':
        text = "Someone gave you Gold!";
        points = -25; // Click to accept/acknowledge
        username = 'Reddit Gold!'; 
        break;
      case 'mod-warning':
        text = "MOD WARNING: Rule violation detected in comments!";
        points = 25; // Click ONLY IF PROTECTED. This is the penalty for clicking unprotected.
        username = 'r/Mods'; 
        break;
      case 'cake-day':
        text = "Happy Cake Day! Here's a power-up!";
        points = 0; // The power-up is the reward, small score bonus in catchObject.
        username = `u/YourCakeDayAlt${Math.floor(Math.random()*100)}`;
        break;
      case 'rickroll':
        text = "Never gonna give you up... Never gonna let you down...";
        points = 3; // Click to DELETE (annoying but low impact)
        username = `u/NeverGonna${Math.floor(Math.random()*100)}`;
        break;
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 70 + 15, // 15% to 85% from left
      y: -5,
      type, 
      speed: 1.5 + Math.random() * 1,
      points,
      caught: false,
      text,
      username
    };
  };

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      combo: 0,
      timeLeft: GAME_DURATION,
      gameObjects: [],
      powerUps: {
        modProtection: false,
        cakeDay: 0
      },
      gameStatus: 'playing',
      postKarma: 1
    }));
  }, []);

  const catchObject = useCallback((objectId: string) => {
    setGameState(prev => {
      const object = prev.gameObjects.find(obj => obj.id === objectId);
      if (!object || object.caught) return prev;

      const updatedObjects = prev.gameObjects.filter(obj => obj.id !== objectId);

      let newScore = prev.score + 1; // Always increment score by 1
      let newCombo = prev.combo;
      let newPowerUps = { ...prev.powerUps };
      let newPostKarma = prev.postKarma;

      // Handle different comment types
      if (['good-comment', 'gold-award'].includes(object.type)) {
        newCombo = prev.combo + 1;
        const multiplier = Math.min(Math.floor(newCombo / 3) + 1, 5); // Cap at 5x
        newPostKarma = prev.postKarma + object.points * multiplier;
      } else if (['bad-comment', 'repost', 'mod-warning', 'rickroll'].includes(object.type)) {
        if (prev.powerUps.modProtection) {
          newPowerUps.modProtection = false; // Use up the protection
        } else {
          newCombo = 0; // Break combo
          newPostKarma = Math.max(1, prev.postKarma + object.points * 2);
        }
      } else if (object.type === 'cake-day') {
        newPowerUps.cakeDay = 5; // 5 seconds of auto-moderation
        newPostKarma = prev.postKarma + 10;
      }

      return {
        ...prev,
        score: newScore,
        combo: newCombo,
        gameObjects: updatedObjects,
        powerUps: newPowerUps,
        postKarma: newPostKarma
      };
    });
  }, []);

  const shareScore = useCallback(() => {
    const modRank = gameState.postKarma >= 1000 ? "Reddit Legend" :
                   gameState.postKarma >= 500 ? "Super Moderator" :
                   gameState.postKarma >= 250 ? "Good Moderator" :
                   gameState.postKarma >= 100 ? "Learning Mod" :
                   gameState.postKarma >= 50 ? "Rookie Mod" : "Chaos Creator";

    const shareText = `🎮 I just survived Reddit Post Panic! My post hit the front page and I moderated ${gameState.score} comments, earning the rank "${modRank}"! 📱\n\nMy post ended with ${gameState.postKarma.toLocaleString()} karma. Can you handle the chaos better than me? #RedditPostPanic`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Reddit Post Panic Results',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard! Share your chaos management skills!');
    }
  }, [gameState.score, gameState.postKarma]);

  return {
    gameState,
    startGame,
    catchObject,
    shareScore
  };
};