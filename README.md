# Transaction Risk Analysis

A web app that shows how banks and AI keep your money safe.

---

## Explain it like I'm 5

Imagine you have a piggy bank, but instead of just a cork in the bottom, a **super-smart robot guard** sits on top of it 24 hours a day. Every time someone tries to take money out, the robot checks a giant list of questions — really, really fast (in less time than it takes to blink).

Here are the questions the robot asks:

**"Is this you?"**
The robot knows your stuff — which phone you use, where you usually buy things, what time of day you like to shop. If everything looks normal, it says *"yep, that's them."* If something feels weird — like your card showing up in another country while you're sitting at home — it gets suspicious.

**"Does this make sense?"**
If you normally buy snacks and toys, and suddenly someone tries to buy 10 laptops, the robot goes *"hmm, that's strange."* It keeps track of everything you've bought before so it knows what's normal for you.

**"Is the computer being sneaky?"**
Bad guys sometimes pretend to be a different computer so the robot doesn't recognize them. The robot is good at spotting fakes — like how you can tell when someone is wearing a bad Halloween costume.

**"How risky is this?"**
The robot gives each purchase a score from 0 to 100. Low number = totally fine, go ahead. High number = something smells fishy, stop and ask more questions. Really high number = **NOPE, blocked.**

If the score is in the middle, the robot sends you a text message like *"Hey, was that you?"* — that's the little code you sometimes have to type in.

**The sneaky bad guys**
Some people try really hard to trick the robot. They might:
- Pretend to be you (steal your password)
- Use a disguised computer
- Steal your phone number so they get your secret code
- Make tiny little fake purchases to test if the robot is watching

The robot has seen all these tricks before and knows how to fight back. And every time a new trick is invented, the robot learns it and gets smarter.

**The most important thing**
The robot makes millions of decisions every single day, for millions of people, all at the same time. It almost never gets it wrong — but when it does and accidentally says "no" to *you*, that's why the bank sometimes calls to double-check. The robot would rather ask a silly question than let a bad guy steal your lunch money.

---

## What this app actually shows

This is a 5-tab interactive reference app built with React + Vite:

| Tab | What it covers |
|---|---|
| **Signal Layers** | The 8 data categories analyzed on every transaction (IP, device, location, behavior, history, merchant, account, network graph) |
| **ML Pipeline** | How gradient boosted trees, LSTMs, graph neural networks, and a rules engine are combined into one risk score |
| **Decision Framework** | Interactive score simulator (drag 0–100) showing what action fires at each risk band, plus portfolio distribution charts |
| **Contextual Factors** | Card-present vs CNP risk, 3DS2 liability shift, consortium intelligence across card networks |
| **Threat Vectors** | 8 attack categories (synthetic ID, ATO, SIM swap, fingerprint spoofing, BIN attacks, APP fraud, adversarial ML, insiders) — each with how the system misses it and specific countermeasures |

---

## Running locally

```bash
npm install
npm run dev
```

Opens at **http://localhost:5174**

---

## Stack

- React 18 + TypeScript
- Vite 5
- Zero external UI libraries — all styles are inline CSS with CSS custom properties
- Fonts: Inter + JetBrains Mono (Google Fonts)
