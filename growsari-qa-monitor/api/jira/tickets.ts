// Vercel serverless function — api/jira/tickets.ts
// Proxies requests to Jira REST API to avoid CORS issues from the browser.
// Set JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN in Vercel environment variables.

import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN } = process.env

  if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) {
    return res.status(500).json({
      error: 'Jira credentials not configured. Set JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN in environment variables.'
    })
  }

  try {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')
    const jql = (req.query.jql as string) ||
      'project in (OPS, ESERV, FINSERV, INFRA, SAR, SF) ORDER BY updated DESC'
    const maxResults = req.query.maxResults || '50'

    const url = `${JIRA_BASE_URL}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}&fields=summary,status,assignee,priority,updated,project`

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const text = await response.text()
      return res.status(response.status).json({ error: `Jira API error: ${response.status}`, detail: text })
    }

    const data = await response.json()

    // Normalize to a flat array for the frontend
    const tickets = (data.issues || []).map((issue: any) => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status?.name || 'Unknown',
      assignee: issue.fields.assignee?.displayName || issue.fields.assignee?.emailAddress || 'Unassigned',
      priority: issue.fields.priority?.name || 'None',
      updated: issue.fields.updated?.slice(0, 10) || '',
      project: issue.fields.project?.name || issue.key.split('-')[0],
    }))

    res.status(200).json({ tickets, total: data.total })
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch from Jira', detail: err.message })
  }
}
