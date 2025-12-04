import React from 'react'
import CardEditor from './CardEditor'


export default function App(){
return (
<div className="app-root">
<header className="header">
<h1>🎄 Create a Christmas Card</h1>
<p>Open source — editable front & back — send a read-only link by email.</p>
</header>
<main>
<CardEditor />
</main>
</div>
)
}
