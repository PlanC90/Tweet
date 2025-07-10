/*
      # Create copied_tweets table

      1. New Tables
        - `copied_tweets`
          - `id` (uuid, primary key)
          - `tweet_id` (integer, ID of the copied tweet)
          - `copied_at` (timestamptz, timestamp when the tweet was copied)
      2. Security
        - Enable RLS on `copied_tweets` table
        - Add policy for authenticated users to read all copied tweets
        - Add policy for authenticated users to insert new copied tweet entries
    */

    CREATE TABLE IF NOT EXISTS copied_tweets (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      tweet_id integer UNIQUE NOT NULL, -- Ensure each tweet is only marked copied once
      copied_at timestamptz DEFAULT now()
    );

    ALTER TABLE copied_tweets ENABLE ROW LEVEL SECURITY;

    -- Allow authenticated users to read the shared copied status
    CREATE POLICY "Authenticated users can read copied tweets"
      ON copied_tweets
      FOR SELECT
      TO authenticated
      USING (true);

    -- Allow authenticated users to mark a tweet as copied
    CREATE POLICY "Authenticated users can insert copied tweets"
      ON copied_tweets
      FOR INSERT
      TO authenticated
      WITH CHECK (true);