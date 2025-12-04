import { useState } from "react";
import axios from "axios";


export default function CardEditor() {
const [frontText, setFrontText] = useState("Merry Christmas");
const [backText, setBackText] = useState("");
const [recipientEmail, setRecipientEmail] = useState("");
const [senderName, setSenderName] = useState("");
const [resultLink, setResultLink] = useState(null);


async function submit() {
const res = await axios.post(`/api/create-card`, {
frontText,
backText,
recipientEmail,
senderName,
});
setResultLink(res.data.link);
}


return (
<div style={{ padding: 20 }}>
<h1>Create Your Christmas Card 🎄</h1>


<label>Front text</label>
<input value={frontText} onChange={(e) => setFrontText(e.target.value)} />


<label>Back text</label>
<textarea value={backText} onChange={(e) => setBackText(e.target.value)} />


<label>Recipient email</label>
<input value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} />


<label>Your name</label>
<input value={senderName} onChange={(e) => setSenderName(e.target.value)} />


<button onClick={submit}>Send Card</button>


{resultLink && (
<p>
Card created! Share this link: <a href={resultLink}>{resultLink}</a>
</p>
)}
</div>
);
}
