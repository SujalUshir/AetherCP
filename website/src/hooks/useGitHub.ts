"use client";

import { useEffect, useState } from "react";
import type { GitHubRepo } from "@/types";

const GITHUB_FALLBACK: GitHubRepo = {
  stars: 48,
  forks: 9,
  issues: 3,
  watchers: 12,
  latestVersion: "v1.2.0",
  license: "MIT",
  lastUpdated: "2026-06-28",
};

export function useGitHub(owner: string, repo: string) {
  const [data, setData] = useState<GitHubRepo>(GITHUB_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRepo() {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          // Rate-limited or not found — use fallback silently
          setError("api_unavailable");
          return;
        }

        const json = await res.json();

        setData({
          stars:         json.stargazers_count ?? GITHUB_FALLBACK.stars,
          forks:         json.forks_count       ?? GITHUB_FALLBACK.forks,
          issues:        json.open_issues_count  ?? GITHUB_FALLBACK.issues,
          watchers:      json.watchers_count     ?? GITHUB_FALLBACK.watchers,
          latestVersion: GITHUB_FALLBACK.latestVersion,
          license:       json.license?.spdx_id  ?? GITHUB_FALLBACK.license,
          lastUpdated:   json.updated_at?.split("T")[0] ?? GITHUB_FALLBACK.lastUpdated,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("fetch_failed");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRepo();
    return () => controller.abort();
  }, [owner, repo]);

  return { data, loading, error };
}
