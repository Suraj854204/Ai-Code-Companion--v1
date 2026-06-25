-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "avatar_url" TEXT,
    "github_token" TEXT,
    "claude_api_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repos" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "repo_name" TEXT NOT NULL,
    "repo_full_name" TEXT NOT NULL,
    "repo_url" TEXT,
    "owner" TEXT,
    "file_tree" JSONB,
    "key_files" JSONB,
    "tech_stack" JSONB,
    "summary" TEXT,
    "last_scanned" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" UUID NOT NULL,
    "repo_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "file_name" TEXT,
    "messages" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "repo_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "deploy_score" INTEGER NOT NULL,
    "checks" JSONB NOT NULL,
    "grade" TEXT NOT NULL,
    "share_token" TEXT NOT NULL,
    "env_example" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "repos_user_id_idx" ON "repos"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "repos_user_id_repo_full_name_key" ON "repos"("user_id", "repo_full_name");

-- CreateIndex
CREATE INDEX "chats_repo_id_idx" ON "chats"("repo_id");

-- CreateIndex
CREATE INDEX "chats_user_id_idx" ON "chats"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "reports_share_token_key" ON "reports"("share_token");

-- CreateIndex
CREATE INDEX "reports_share_token_idx" ON "reports"("share_token");

-- CreateIndex
CREATE INDEX "reports_repo_id_idx" ON "reports"("repo_id");

-- AddForeignKey
ALTER TABLE "repos" ADD CONSTRAINT "repos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_repo_id_fkey" FOREIGN KEY ("repo_id") REFERENCES "repos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_repo_id_fkey" FOREIGN KEY ("repo_id") REFERENCES "repos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
