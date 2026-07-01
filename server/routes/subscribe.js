import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'

const router = Router()

async function verifyCaptchaToken(token) {
  if (!process.env.TURNSTILE_SECRET_KEY) return true
  if (!token) return false

  const params = new URLSearchParams()
  params.append('secret', process.env.TURNSTILE_SECRET_KEY)
  params.append('response', token)

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: params,
  })
  const data = await response.json()
  return Boolean(data.success)
}

router.post('/', async (req, res) => {
  const { email, captchaToken } = req.body

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Database not configured.' })
  }

  try {
    const captchaOk = await verifyCaptchaToken(captchaToken)
    if (!captchaOk) {
      return res.status(400).json({ error: 'CAPTCHA verification failed.' })
    }

    const { error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert({ email })

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Member Exists' })
      }
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: 'Sucesso! E-mail cadastrado.' })
  } catch (error) {
    console.error('Newsletter error:', error)
    res.status(500).json({ error: 'Erro interno no servidor.' })
  }
})

export default router
