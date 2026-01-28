-- Create connections table for user relationships
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connected_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, connected_user_id),
  CHECK (user_id != connected_user_id)
);

-- Enable RLS on connections
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for connections
CREATE POLICY "Users can view their connections"
  ON connections FOR SELECT
  USING (
    auth.uid() = user_id OR auth.uid() = connected_user_id
  );

CREATE POLICY "Users can create connection requests"
  ON connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their connection requests"
  ON connections FOR UPDATE
  USING (
    auth.uid() = connected_user_id OR auth.uid() = user_id
  )
  WITH CHECK (
    auth.uid() = connected_user_id OR auth.uid() = user_id
  );

-- Create indexes
CREATE INDEX idx_connections_user_id ON connections(user_id);
CREATE INDEX idx_connections_connected_user_id ON connections(connected_user_id);
CREATE INDEX idx_connections_status ON connections(status);
