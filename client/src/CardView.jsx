import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


export default function CardView() {
const { id } = useParams();
const [card, setCard] = useState(null);


useEffect(() => {
async function load() {
const res = await axios.get(`/api/get-card?id=${id}`);
setCard(res.data);
}
load();
}, [id]);


if (!card) return <p>Loading…</p>;


return (
<div style={{ padding: 20 }}>
<h1>{card.frontText}</h1>
<p>{card.backText}</p>
<p><em>Christmas greetings from {card.senderName}</em></p>
</div>
);
}
