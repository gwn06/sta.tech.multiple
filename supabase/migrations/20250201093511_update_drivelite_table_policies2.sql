-- Enable row-level security
ALTER TABLE drivelite ENABLE ROW LEVEL SECURITY;

-- Policy for inserting images
CREATE POLICY "All authenticated users can upload images." 
ON drivelite 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Policy for selecting images
CREATE POLICY "All authenticated users can view images." 
ON drivelite 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Policy for updating images
CREATE POLICY "All authenticated users can update images." 
ON drivelite 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Policy for deleting images
CREATE POLICY "All authenticated users can delete images." 
ON drivelite 
FOR DELETE 
USING (auth.uid() IS NOT NULL);
