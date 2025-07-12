/*
      # Add user_id to copied_tweets table and update RLS

      1. Changes
        - `copied_tweets`
          - Add `user_id` column (uuid, foreign key to auth.users)
          - Add unique constraint on (`tweet_id`, `user_id`)
      2. Security
        - Update RLS policies on `copied_tweets` table to ensure users can only access their own data.
    */

    -- Add user_id column if it doesn't exist
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'copied_tweets' AND column_name = 'user_id'
      ) THEN
        ALTER TABLE copied_tweets ADD COLUMN user_id uuid REFERENCES auth.users(id);
      END IF;
    END $$;

    -- Add unique constraint on tweet_id and user_id if it doesn't exist
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'copied_tweets_tweet_id_user_id_key' -- Check for the default generated name
      ) THEN
        -- Attempt to add the unique constraint
        BEGIN
          ALTER TABLE copied_tweets ADD CONSTRAINT copied_tweets_tweet_id_user_id_key UNIQUE (tweet_id, user_id);
        EXCEPTION
          WHEN duplicate_object THEN
            -- Constraint already exists, do nothing
            NULL;
        END;
      END IF;
    END $$;


    -- Update RLS policies
    -- Drop existing policies if they exist (safer to recreate)
    -- Corrected policy names in DROP statements
    DROP POLICY IF EXISTS "Users can read own copied tweets" ON copied_tweets;
    DROP POLICY IF EXISTS "Users can insert own copied tweets" ON copied_tweets;

    -- Enable RLS (ensure it's enabled)
    ALTER TABLE copied_tweets ENABLE ROW LEVEL SECURITY;

    -- Policy to allow authenticated users to read their own copied tweets
    CREATE POLICY "Users can read own copied tweets"
      ON copied_tweets
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    -- Policy to allow authenticated users to insert their own copied tweets
    CREATE POLICY "Users can insert own copied tweets"
      ON copied_tweets
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

    -- Optional: Policy to prevent updates/deletes (adjust if needed)
    -- CREATE POLICY "Users cannot update copied tweets"
    --   ON copied_tweets
    --   FOR UPDATE
    --   TO authenticated
    --   USING (false); -- Prevent updates

    -- CREATE POLICY "Users cannot delete copied tweets"
    --   ON copied_tweets
    --   FOR DELETE
    --   TO authenticated
    --   USING (false); -- Prevent deletes