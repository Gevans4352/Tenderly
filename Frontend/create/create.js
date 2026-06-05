const API_BASE = 'http://localhost:5000/api'
const token = localStorage.getItem('token')
const username = localStorage.getItem('username')

if (!token) window.location.href = 'login.html'

const titleInput    = document.getElementById('title')
const bodyInput     = document.getElementById('body')
const moodInput     = document.getElementById('mood')
const eraInput      = document.getElementById('era')
const anonInput     = document.getElementById('isAnonymous')
const submitBtn     = document.getElementById('submitBtn')
const errorMsg      = document.getElementById('error')

const previewTitle  = document.getElementById('previewTitle')
const previewBody   = document.getElementById('previewBody')
const previewTag    = document.getElementById('previewTag')
const previewAnon   = document.getElementById('previewAnon')
const previewEra    = document.getElementById('previewEra')

// live preview
titleInput.addEventListener('input', () => {
    const val = titleInput.value.trim()
    previewTitle.textContent = val || 'your exhibit will appear here'
    previewTitle.classList.toggle('has-content', val.length > 0)
})

bodyInput.addEventListener('input', () => {
    const val = bodyInput.value.trim()
    previewBody.textContent = val || 'start writing to see a preview...'
    previewBody.classList.toggle('has-content', val.length > 0)
})

moodInput.addEventListener('change', () => {
    previewTag.textContent = moodInput.value || 'memory'
})

eraInput.addEventListener('change', () => {
    previewEra.textContent = eraInput.value || ''
})

anonInput.addEventListener('change', () => {
    previewAnon.textContent = anonInput.checked ? 'by anon' : `by ${username}`
})

// submit
submitBtn.addEventListener('click', async () => {
    const title = titleInput.value.trim()
    const body  = bodyInput.value.trim()

    if (!title) return errorMsg.textContent = 'give it a name first'
    if (!body)  return errorMsg.textContent = 'describe it a little'

    errorMsg.textContent = ''
    submitBtn.textContent = 'placing in the museum...'
    submitBtn.disabled = true

    try {
        const res = await fetch(`${API_BASE}/artifacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                body,
                mood_tag: moodInput.value || null,
                era_tag: eraInput.value || null,
                is_anonymous: anonInput.checked
            })
        })

        const data = await res.json()

        if (!res.ok) {
            errorMsg.textContent = data.error || 'something went wrong'
            submitBtn.textContent = 'place in the museum'
            submitBtn.disabled = false
            return
        }

        window.location.href = `exhibit.html?id=${data.id}`

    } catch (err) {
        errorMsg.textContent = 'could not reach the museum'
        submitBtn.textContent = 'place in the museum'
        submitBtn.disabled = false
    }
})