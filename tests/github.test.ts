import { describe, it, expect } from 'vitest';
import { parseGithubEvents } from '../app/(main)/lib/github';

describe('parseGithubEvents', () => {
    it('parses push events with commit counts', () => {
        const events = [
            {
                type: 'PushEvent',
                repo: { name: 'tomalmog/crucible' },
                created_at: '2026-07-27T10:00:00Z',
                payload: {
                    commits: [
                        { message: 'Fix eval harness' },
                        { message: 'Add LoRA sweep\n\nlong body' },
                    ],
                },
            },
        ];
        const items = parseGithubEvents(events);
        expect(items).toHaveLength(1);
        expect(items[0].repo).toBe('tomalmog/crucible');
        expect(items[0].message).toBe('Add LoRA sweep (+1 more)');
        expect(items[0].url).toBe('https://github.com/tomalmog/crucible');
    });

    it('includes repo creations, opened PRs, and releases; skips noise', () => {
        const events = [
            { type: 'WatchEvent', repo: { name: 'x/y' }, created_at: '2026-07-27T10:00:00Z' },
            {
                type: 'CreateEvent',
                repo: { name: 'tomalmog/new-thing' },
                created_at: '2026-07-26T10:00:00Z',
                payload: { ref_type: 'repository' },
            },
            {
                type: 'PullRequestEvent',
                repo: { name: 'tomalmog/crucible' },
                created_at: '2026-07-25T10:00:00Z',
                payload: { action: 'opened', pull_request: { title: 'Add evals', html_url: 'https://github.com/pr/1' } },
            },
        ];
        const items = parseGithubEvents(events);
        expect(items).toHaveLength(2);
        expect(items[0].message).toBe('Created repository');
        expect(items[1].message).toBe('Opened PR: Add evals');
        expect(items[1].url).toBe('https://github.com/pr/1');
    });

    it('falls back to branch names when commits are omitted, collapsing runs', () => {
        const push = (ref: string) => ({
            type: 'PushEvent',
            repo: { name: 'tomalmog/yc-visualizations' },
            created_at: '2026-07-18T04:32:07Z',
            payload: { ref, head: 'abc', before: 'def' },
        });
        const items = parseGithubEvents([push('refs/heads/main'), push('refs/heads/main'), push('refs/heads/main')]);
        expect(items).toHaveLength(1);
        expect(items[0].message).toBe('Pushed 3× to main');
    });

    it('respects the limit and tolerates junk', () => {
        const push = (i: number) => ({
            type: 'PushEvent',
            repo: { name: `tomalmog/r${i}` },
            created_at: '2026-07-27T10:00:00Z',
            payload: { commits: [{ message: `c${i}` }] },
        });
        const events = Array.from({ length: 20 }, (_, i) => push(i));
        expect(parseGithubEvents(events, 5)).toHaveLength(5);
        expect(parseGithubEvents([] as any)).toHaveLength(0);
        expect(parseGithubEvents([{ type: 'PushEvent' }] as any)).toHaveLength(0);
    });
});
