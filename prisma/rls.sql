-- Enable Row Level Security on BlogPost table
ALTER TABLE "BlogPost" ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view blog posts
CREATE POLICY "Anyone can view blog posts" ON "BlogPost"
FOR SELECT USING (true);

-- Policy: Authenticated users can create their own posts
CREATE POLICY "Authenticated users can create posts" ON "BlogPost"
FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid()::text = "userId");

-- Policy: Authors can update their own posts
CREATE POLICY "Authors can update their own posts" ON "BlogPost"
FOR UPDATE USING (auth.uid()::text = "userId");

-- Policy: Authors can delete their own posts
CREATE POLICY "Authors can delete their own posts" ON "BlogPost"
FOR DELETE USING (auth.uid()::text = "userId");

-- Enable Row Level Security on Like table
ALTER TABLE "Like" ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view likes (for like counts)
CREATE POLICY "Anyone can view likes" ON "Like"
FOR SELECT USING (true);

-- Policy: Authenticated users can like posts (prevent duplicates through unique constraints)
CREATE POLICY "Authenticated users can like posts" ON "Like"
FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid()::text = "userId");

-- Policy: Users can remove their own likes
CREATE POLICY "Users can remove their own likes" ON "Like"
FOR DELETE USING (auth.uid()::text = "userId");