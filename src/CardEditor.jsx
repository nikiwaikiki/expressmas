import React, { useState } from 'react'
import axios from 'axios'


export default function CardEditor(){
const [frontText, setFrontText] = useState('Merry Christmas')
const [backText, setBackText] = useState('Wishing you joy and peace this holiday season.')
const [recipientEmail, setRecipientEmail] = useState('')
const [senderName, setSenderName] = useState('')
const [sending, setSending] = useState(false)
const [resultLink, setResultLink] = useState(null)
const [flip, setFlip] = useState(false)
const apiBase = 'expressmas';

const res = await axios.post(`expressmas/api/create-card`, {
  frontText, backText, recipientEmail, senderName

async function handleSend(e){
e.preventDefault();
setSending(true)
setResultLink(null)
try{
const res = await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api/cards', {
frontText, backText, recipientEmail, senderName
})
setResultLink(res.data.link)
}catch(err){
alert('Failed to send card: ' + (err?.response?.data?.error || err.message))
}finally{ setSending(false) }
}


return (
<div className="editor-root">
<div className={`card-preview ${flip ? 'flipped' : ''}`} onClick={()=>setFlip(s=>!s)}>
<div className="card-inner">
<div className="card-front">
<div className="card-bg">
<div className="front-text" contentEditable={true} suppressContentEditableWarning={true}
onInput={(e)=>setFrontText(e.currentTarget.textContent)}
>{frontText}</div>
</div>
</div>
<div className="card-back">
<div className="back-text">
<textarea value={backText} onChange={(e)=>setBackText(e.target.value)} />
</div>
</div>
</div>
</div>


<form className="send-form" onSubmit={handleSend}>
<label>Recipient email
<input type="email" value={recipientEmail} onChange={(e)=>setRecipientEmail(e.target.value)} required />
</label>
<label>Your name (will appear as "Christmas Greetings From {name}")
<input type="text" value={senderName} onChange={(e)=>setSenderName(e.target.value)} required />
</label>
<div className="buttons">
<button type="button" onClick={()=>setFlip(s=>!s)} className="btn">Preview {flip? 'Front': 'Back'}</button>
<button type="submit" className="btn primary" disabled={sending}>{sending? 'Sending...': 'Send card'}</button>
</div>
</form>


{resultLink && (
<div className="result">
<p>Finished — recipient link (read-only):</p>
<a href={resultLink} target="_blank" rel="noreferrer">{resultLink}</a>
</div>
)}


<p className="hint">Tip: click the card to flip. Edit the front by typing directly on the front text area.</p>
</div>
)
}
