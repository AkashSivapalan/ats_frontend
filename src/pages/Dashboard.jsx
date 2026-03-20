import { useState } from 'react'
import { apiFetch, ApiError } from '../api/client.js'
import { useAuth } from '../auth/useAuth.js'
import { AnalyzeResult } from '../components/AnalyzeResult.jsx'

function getAnalyzeErrorMessage(err) {
  if (err instanceof ApiError && err.status === 429) {
    try {
      const body = err.bodyText ? JSON.parse(err.bodyText) : null
      if (body?.detail) return body.detail
    } catch {
      // ignore parse error
    }
    return "You've reached the daily analysis limit. Try again tomorrow."
  }
  return err instanceof Error ? err.message : 'Analyze failed.'
}

export function DashboardPage() {
  const auth = useAuth()

  const [resumeFile, setResumeFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')
  const [uploadErr, setUploadErr] = useState('')

  const [jobDescription, setJobDescription] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeErr, setAnalyzeErr] = useState('')
  const [result, setResult] = useState(null)
  const [rateLimitMessage, setRateLimitMessage] = useState(null)

  async function onUploadResume(e) {
    e.preventDefault()
    setUploadMsg('')
    setUploadErr('')

    if (!resumeFile) {
      setUploadErr('Please choose a resume file first.')
      return
    }

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', resumeFile)

      await apiFetch('/resumes', {
        method: 'POST',
        body: fd,
        isJson: false,
        authToken: auth.token,
      })

      setUploadMsg('Resume uploaded successfully.')
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : 'Resume upload failed.')
    } finally {
      setUploading(false)
    }
  }

  async function onAnalyze(e) {
    e.preventDefault()
    setAnalyzeErr('')
    setResult(null)
    setRateLimitMessage(null)

    const jd = jobDescription.trim()
    if (!jd) {
      setAnalyzeErr('Please paste a job description.')
      return
    }

    setAnalyzing(true)
    try {
      const res = await apiFetch('/analyze', {
        method: 'POST',
        body: { jobDescription: jd },
        isJson: true,
        authToken: auth.token,
      })
      setResult(res)
    } catch (err) {
      const msg = getAnalyzeErrorMessage(err)
      if (err instanceof ApiError && err.status === 429) {
        setRateLimitMessage(msg)
      } else {
        setAnalyzeErr(msg)
      }
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="grid2">
      <div className="panel">
        <h1 className="panelTitle">Upload resume</h1>
        <p className="helper">
          Upload your resume first, then paste a job description for analysis.
        </p>

        {uploadErr && <div className="errorBox">{uploadErr}</div>}
        {uploadMsg && <div className="successBox">{uploadMsg}</div>}

        <form className="form" onSubmit={onUploadResume}>
          <div className="field">
            <div className="labelRow">
              <label className="label" htmlFor="resume">
                Resume file
              </label>
              <span className="hint">PDF / DOCX recommended</span>
            </div>
            <input
              id="resume"
              className="input"
              type="file"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx"
            />
          </div>

          <button className="btn btnPrimary" disabled={uploading} type="submit">
            {uploading ? 'Uploading…' : 'Upload resume'}
          </button>
        </form>

        <div className="hr" />

        <h2 className="panelTitle" style={{ marginTop: 0 }}>
          Analyze job description
        </h2>
        <p className="helper">
          Paste the job description text. The backend returns a score, matching skills,
          missing skills, and suggestions.
        </p>

        {analyzeErr && <div className="errorBox">{analyzeErr}</div>}

        <form className="form" onSubmit={onAnalyze}>
          <div className="field">
            <div className="labelRow">
              <label className="label" htmlFor="jd">
                Job description
              </label>
              <span className="hint">{jobDescription.length} chars</span>
            </div>
            <textarea
              id="jd"
              className="textarea"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here…"
            />
          </div>

          <button className="btn btnPrimary" disabled={analyzing} type="submit">
            {analyzing ? 'Analyzing…' : 'Analyze'}
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {result ? (
          <AnalyzeResult result={result} />
        ) : rateLimitMessage ? (
          <div className="panel">
            <h2 className="panelTitle" style={{ margin: 0 }}>
              Results
            </h2>
            <div className="errorBox" style={{ marginTop: 12 }}>
              {rateLimitMessage}
            </div>
            <p className="helper" style={{ marginTop: 12 }}>
              You can try again tomorrow or continue uploading resumes.
            </p>
          </div>
        ) : (
          <div className="panel">
            <h2 className="panelTitle" style={{ margin: 0 }}>
              Results
            </h2>
            <p className="helper" style={{ marginTop: 10 }}>
              Run an analysis to see your score and skill breakdown here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

