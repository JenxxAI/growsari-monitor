// Vercel serverless function — api/testpad/runs.ts
// Proxies requests to Testpad API to avoid CORS issues from the browser.
// Set TESTPAD_BASE_URL and TESTPAD_API_KEY in Vercel environment variables.

import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { TESTPAD_BASE_URL, TESTPAD_API_KEY } = process.env

  if (!TESTPAD_BASE_URL || !TESTPAD_API_KEY) {
    return res.status(500).json({
      error: 'Testpad credentials not configured. Set TESTPAD_BASE_URL and TESTPAD_API_KEY in environment variables.'
    })
  }

  try {
    const projectId = req.query.projectId as string | undefined
    const endpoint = projectId
      ? `${TESTPAD_BASE_URL}/api/v1/projects/${projectId}/runs`
      : `${TESTPAD_BASE_URL}/api/v1/runs`

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${TESTPAD_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const text = await response.text()
      return res.status(response.status).json({ error: `Testpad API error: ${response.status}`, detail: text })
    }

    const data = await response.json()

    // Normalize to expected shape — adjust field names based on actual Testpad API response
    const runs = (Array.isArray(data) ? data : data.runs || []).map((run: any) => ({
      id: run.id || run._id,
      name: run.name || run.title,
      status: run.status || 'unknown',
      progress: run.progress ?? Math.round(((run.passed || 0) / (run.total || 1)) * 100),
      total: run.total || run.totalTests || 0,
      passed: run.passed || run.passedTests || 0,
      failed: run.failed || run.failedTests || 0,
      blocked: run.blocked || run.blockedTests || 0,
      assignee: run.assignee || run.tester || 'Unassigned',
      project: run.project || run.projectName || '',
    }))

    res.status(200).json({ runs })
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch from Testpad', detail: err.message })
  }
}
