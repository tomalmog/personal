// Pure parser for the public GitHub events feed. Kept free of fetch/IO for testing.

export interface GithubActivityItem {
    repo: string;
    message: string;
    date: string; // ISO
    url: string;
}

type Json = Record<string, any>;

export function parseGithubEvents(events: Json[], limit = 8): GithubActivityItem[] {
    const items: GithubActivityItem[] = [];
    for (const e of events ?? []) {
        const repo: string = e?.repo?.name ?? '';
        const repoUrl = `https://github.com/${repo}`;
        const date: string = e?.created_at ?? '';
        if (!repo || !date) continue;

        if (e.type === 'PushEvent') {
            const commits: Json[] = e?.payload?.commits ?? [];
            const head = commits[commits.length - 1];
            if (head?.message) {
                const extra = commits.length > 1 ? ` (+${commits.length - 1} more)` : '';
                items.push({
                    repo,
                    message: `${String(head.message).split('\n')[0]}${extra}`,
                    date,
                    url: repoUrl,
                });
            } else {
                // The unauthenticated events feed omits commit details; fall
                // back to the branch name and collapse consecutive pushes.
                const branch = String(e?.payload?.ref ?? '').split('/').pop() || 'main';
                const prev = items[items.length - 1];
                const pushMatch = prev?.repo === repo && /^Pushed (\d+× )?to /.test(prev.message);
                if (pushMatch) {
                    const count = Number(prev.message.match(/^Pushed (\d+)×/)?.[1] ?? 1) + 1;
                    prev.message = `Pushed ${count}× to ${branch}`;
                } else {
                    items.push({ repo, message: `Pushed to ${branch}`, date, url: repoUrl });
                }
            }
        } else if (e.type === 'CreateEvent' && e?.payload?.ref_type === 'repository') {
            items.push({ repo, message: 'Created repository', date, url: repoUrl });
        } else if (e.type === 'PullRequestEvent' && e?.payload?.action === 'opened') {
            items.push({
                repo,
                message: `Opened PR: ${e?.payload?.pull_request?.title ?? ''}`,
                date,
                url: e?.payload?.pull_request?.html_url ?? repoUrl,
            });
        } else if (e.type === 'ReleaseEvent' && e?.payload?.action === 'published') {
            items.push({
                repo,
                message: `Released ${e?.payload?.release?.tag_name ?? ''}`,
                date,
                url: e?.payload?.release?.html_url ?? repoUrl,
            });
        }

        if (items.length >= limit) break;
    }
    return items;
}
