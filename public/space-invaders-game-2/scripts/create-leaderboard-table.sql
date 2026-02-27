-- Create leaderboard table for Stitch Invaders game
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  level_reached INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_created_at ON leaderboard(created_at DESC);

-- Insert some sample data
INSERT INTO leaderboard (player_name, score, level_reached) VALUES
('STITCH', 5420, 3),
('LILO', 4890, 2),
('NANI', 3540, 2),
('JUMBA', 2750, 1),
('PLEAKLEY', 1980, 1);
