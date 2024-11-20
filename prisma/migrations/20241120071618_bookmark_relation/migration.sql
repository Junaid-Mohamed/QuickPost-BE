-- CreateTable
CREATE TABLE "_BookmarkedPosts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookmarkedPosts_AB_unique" ON "_BookmarkedPosts"("A", "B");

-- CreateIndex
CREATE INDEX "_BookmarkedPosts_B_index" ON "_BookmarkedPosts"("B");

-- AddForeignKey
ALTER TABLE "_BookmarkedPosts" ADD CONSTRAINT "_BookmarkedPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookmarkedPosts" ADD CONSTRAINT "_BookmarkedPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
