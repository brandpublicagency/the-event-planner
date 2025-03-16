
-- Create a table to cache weather data
CREATE TABLE IF NOT EXISTS cached_weather (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data JSONB NOT NULL
);

-- Create an index on the timestamp for quick lookup
CREATE INDEX IF NOT EXISTS cached_weather_timestamp_idx ON cached_weather (timestamp);
