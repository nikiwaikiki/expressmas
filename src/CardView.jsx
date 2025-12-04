import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'


export default function CardView(){
const { id } = useParams();
const [card, setCard] = useState(null)
const [error, setError] = useState(null)
const res = await axios.get(`/api/get-card`);
setCard(res.data);

useEffect(()=>{
axios.get((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api/cards/' + id)
.then(r=>setCard(r.data))
.catch(e=>setError(e?.response?.data?.error || 'Failed to load card'))
},[id])


if (error) return <div className="view-root"><h2>{error}</h2></div>
if (!card) return <div className="view-root"><h2>Loading...</h2></div>


return (
<div className="view-root">
<div className="final-header">Christmas Greetings From "{card.senderName}"</div>
<div className="card-display">
<div className="card-static">
<div className="card-front static-front">
<div className="card-bg">
<div className="front-text static">{card.frontText}</div>
</div>
</div>
<div className="card-back static-back">
<div className="back-text static">{card.backText}</div>
</div>
</div>
</div>
</div>
)
}
