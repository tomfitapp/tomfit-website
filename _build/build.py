#!/usr/bin/env python3
"""Generates the TOMfit.app static pages into the repo folder."""
import html, json, os
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://tomfit.app'
import hashlib
V = lambda f: hashlib.md5(open(os.path.join(OUT, f), 'rb').read()).hexdigest()[:8]
E = html.escape

MAILTO = 'mailto:hello@tomfit.app?subject=I%20would%20like%20to%20be%20a%20TOMfit%20tester'
CURRENCY = 'Payment is taken in pounds (£). Dollar prices are a guide only – your bank converts the amount, so the final charge may be slightly different (often a little lower).'

def head(path, title, desc, extra=''):
    url = SITE + path
    return f'''<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="TOMfit">
<meta property="og:title" content="{E(title)}">
<meta property="og:description" content="{E(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0a45a3">
<link rel="icon" href="/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap">
<link rel="stylesheet" href="/assets/site.css?v={V('assets/site.css')}">
{extra}</head>
<body>
<a class="skip" href="#main">Skip to content</a>
'''

def header(page, pill):
    nav = [('home', 'Home', '', '/'), ('test', 'Test TOM', 'fit', '/#testers'), ('app', 'The App', '', '/app'),
           ('info', 'Info-Bank', '', '/info-bank'), ('tools', 'Tools', '', '/tools'), ('shop', 'Shop', '', '/shop'), ('puzzles', 'Puzzles', '', '/puzzles')]
    navh = ''.join(f'<a href="{h}" class="navl{" on" if k == page else ""}"{" aria-current=\"page\"" if k == page else ""}>{a}{f"<span class=\"py\">{b}</span>" if b else ""}</a>' for k, a, b, h in nav)
    pills = [('app', 'TOM', 'fit', ' app', '/app'), ('info', 'Info-Bank', '', '', '/info-bank'), ('tools', 'Tools', '', '', '/tools'),
             ('shop', 'Shop', '', '', '/shop'), ('puzzles', 'Puzzles', '', '', '/puzzles')]
    pillh = ''.join(f'<a href="{h}" class="pill{" on" if k == pill else ""}"{" target=\"_blank\" rel=\"noopener\"" if k == "tomtech" else ""}>{a}{f"<span class=\"py\">{b}</span>" if b else ""}{c}</a>' for k, a, b, c, h in pills)
    imgs = ''.join(f'<img src="/img/{m}.jpg" alt="" width="520" height="1127">' for m in ['08_exercise_kettlebell_swing', '09_settings', '01_walk', '02_walk_progress_charts', '03_health'])
    dots = '<span></span>' * 9
    slim = page != 'home'
    return f'''<header class="hd{' slim' if slim else ''}">
<div class="wrap">
  <div class="topbar">
    <a href="/" class="logo" aria-label="TOMfit.app home"><img src="/img/logo.png" alt="TOMfit.app" width="480" height="160"></a>
    <nav class="navs" aria-label="Main menu">{navh}</nav>
  </div>
  {'' if slim else hero(page, imgs, dots)}
  <nav class="pills" aria-label="Sections">{pillh}</nav>
</div>
</header>
'''

def hero(page, imgs, dots):
    tag = 'h1' if page == 'home' else 'div'
    return f'''<div class="hero">
    <div>
      <{tag} class="hh">Getting<br>health back<br><span>under control</span></{tag}>
      <p>I created TOMfit for people like me: 50+, struggling with weight, living with diabetes and unsure where to begin. No judgement, no impossible routines – just simple ways to start and keep going.</p>
    </div>
    <div class="carw">
      <div class="car" data-car>
        <button class="rbtn" data-prev aria-label="Previous picture">‹</button>
        <div class="imgs">{imgs}</div>
        <button class="rbtn" data-next aria-label="Next picture">›</button>
      </div>
      <div class="cap" data-cap aria-live="polite"></div>
      <div class="dots" data-dots aria-hidden="true">{dots}</div>
    </div>
  </div>'''

FOOTER = '''<footer class="ft">
<div class="wrap">
  <p class="slog">You do not have to become an athlete.<br>You only have to begin.</p>
  <div class="fcols">
    <div><b>Contact</b><a href="mailto:hello@tomfit.app" style="font-size:18px;font-weight:600">hello@tomfit.app</a><span>Questions, ideas or want to be a tester? Just email us.</span></div>
    <div><b>Good to know</b><span><b style="font-size:16px">Not medical advice.</b> TOMfit is for general fitness and personal logging only. <a href="/legal#health">Read our health notice</a>.</span><span>Your health data stays on your phone.</span></div>
    <div><b>Legal</b><a href="/legal#privacy">Privacy policy</a><a href="/legal#health">Health notice &amp; disclaimer</a><a href="/legal#terms">Terms of sale</a><a href="/#testers">Tester terms</a></div>
  </div>
  <div class="fbar"><span>© 2026 TOMfit · tomfit.app</span><span>Made for people 50+ who want to start, not to compete.</span></div>
  <p class="fdisc">Disclaimer: all information on this website is general information only. It is not medical advice and is not designed to replace advice from your doctor or another qualified healthcare professional. TOMfit is not a medical device.</p>
</div>
</footer>
<script src="/assets/site.js?v=__JSV__" defer></script>
</body>
</html>
'''

FOOTER = FOOTER.replace('__JSV__', V('assets/site.js'))

def page(fn, path, title, desc, nav, pill, body, extra=''):
    with open(os.path.join(OUT, fn), 'w') as f:
        f.write(head(path, title, desc, extra) + header(nav, pill) + body + FOOTER)

# ------------------------------------------------------------------ HOME
FEATS = [('Walk', '01_walk', 'Time, distance, steps and speed, with simple daily goals.', 'walk'),
         ('Health', '03_health', 'Blood glucose, blood pressure, weight and fasting – plus a report.', 'health'),
         ('Meds &amp; supps', '05_meds', 'Your list, daily times and a tick when you have taken them.', 'meds'),
         ('Exercises', '07_exercise_daily_core_chair_squats', '10 easy exercises with large pictures, at your own pace.', 'exercises'),
         ('Settings', '09_settings', 'Switch parts on or off, set your goals. Data stays on your phone.', 'settings')]
steps = [('1', '', 'Register by email', 'Send your name and the Gmail address on your Android phone to hello@tomfit.app.'),
         ('2', '', 'Get the test app', 'We send you a link to install TOMfit from Google Play.'),
         ('3', '', 'Open it every day', 'Use it as you like and answer one short question each week.'),
         ('4', ' y', 'Finish all 8 weeks', 'Complete the evaluation and your free 1 year subscription is activated after launch.')]
ld = {"@context": "https://schema.org", "@graph": [
    {"@type": "Organization", "name": "TOMfit", "url": SITE + "/", "logo": SITE + "/img/logo.png", "email": "hello@tomfit.app", "sameAs": ["https://tomtech.news"]},
    {"@type": "WebSite", "name": "TOMfit", "url": SITE + "/"}]}
home = f'''<main id="main" class="pg home">
<section id="testers" class="testers" aria-labelledby="th">
  <div class="tcols">
    <div>
      <span class="tag">We are looking for testers</span>
      <h2 id="th" class="bigh">Test TOM<span class="fit">fit</span> for 8 weeks.<br><span class="b">Earn 1 year free.</span></h2>
      <p style="font-size:20px;line-height:1.55">Help us make TOMfit the best simple health app for people over 50. Use it every day for 8 weeks, tell us what you think, and when you finish, a free 1 year subscription is yours, <b>worth £29.95 / US$39.95</b>.</p>
      <div class="steps">{"".join(f'<div class="step"><span class="{c.strip()}">{n}</span><div><b>{t}</b><div>{d}</div></div></div>' for n, c, t, d in steps)}</div>
      <p class="why"><b>Why a reward?</b> Testing takes real time and care. The free 1 year subscription is our thank you for a job well done. It is earned by completing the full 8 weeks, not given for signing up.</p>
    </div>
    <div class="qrbox">
      <img src="/img/tester-qr.png" alt="QR code: scan to email us and register as a TOMfit tester" width="240" height="240">
      <div style="font-size:17px;line-height:1.45">Scan with your phone camera,<br>or tap the button:</div>
      <a class="btn y" href="{MAILTO}">Register as a tester</a>
      <div style="font-size:15px;color:#33496b;line-height:1.45">You need an Android phone and a Gmail address.<br>Places are limited.</div>
    </div>
  </div>
</section>

<section aria-labelledby="fh">
  <div class="sechd">
    <div><div class="eyebrow g">What the app does</div><h2 id="fh">Five simple parts. One app.</h2></div>
    <a href="/app">See the full guide to the app →</a>
  </div>
  <div class="feat">{"".join(f'<a class="fcard" href="/app#{a}"><div class="im"><img src="/img/{i}.jpg" alt="{n} page of the TOMfit app" width="520" height="1127" loading="lazy"></div><div class="tx"><span class="gtag">{n}</span><span>{t}</span></div></a>' for n, i, t, a in FEATS)}</div>
</section>

<section>
  <figure class="quote" style="margin:0 auto">
    <div class="eyebrow">Why TOMfit exists · built from experience, not perfection</div>
    <blockquote>“I couldn’t pretend any longer that my health was OK. I needed help – and I had to act.”</blockquote>
    <p>At 64, after years of desk work and almost no exercise, I had a serious problem with my weight, type 2 diabetes, high blood pressure, sleep apnoea and more. My health was in dire straits, and I could not ignore it any longer. TOMfit begins where many people over 50 actually are. Taking the first step can be difficult – but it is possible.</p>
    <figcaption class="who"><span>T</span><div><b>Tom</b> <span style="font-size:15px;opacity:.85">· Founder of TOMfit</span></div></figcaption>
  </figure>
</section>
</main>
'''
page('index.html', '/', 'TOMfit – Simple Health & Fitness App for Adults 50+',
     'Walk more, track blood pressure, blood sugar and weight, and never miss your meds. A simple Android app for over-50s. Test it and earn 1 year free.',
     'home', 'none', home, f'<script type="application/ld+json">{json.dumps(ld)}</script>\n')

# ------------------------------------------------------------------ APP
S = [
 ('walk', 'walk', 'Walk', 'TOMfit promotes brisk walking – a moderate-intensity form of walking, typically around 5–6.5 km/h (3–4 mph). One big button starts your walk.',
  ['Start and pause your walk with one button', 'Walking time, brisk minutes, distance, steps and speed', 'Simple daily goals: 30 min, 2 km, 3,000 steps – change them in Settings', 'Charts for today, this week and the last 12 weeks', 'Brisk walking means 100 or more steps a minute'],
  ['01_walk', '02_walk_progress_charts'], 'people-walk', 'Brisk walking is a moderate-intensity form of walking. The WHO recommends 150–300 minutes a week. Keep an eye on your pace: 100+ steps a minute, or about 5 km/h. TOMfit starts you at the easier end.'),
 ('health', 'health', 'Health', 'Keep your important numbers in one place and see at a glance whether you are going in the right direction.',
  ['Record your blood glucose', 'Record your blood pressure and pulse', 'Record your weight – BMI is worked out for you', 'Log your fasting time between last and first meal', 'A health report to show your doctor'],
  ['03_health', '04_health_report'], 'people-health', 'I check my blood glucose and blood pressure at least once a day, I keep an eye on my weight and BMI, and I like to check the time between my last and first meal – all to be sure I am going in the right direction.'),
 ('meds', 'meds & supps', 'Medication & supplements', 'Your full list in one place, with the times you take them and a simple tick when it’s done.',
  ['Add a medication or supplement: name, dose and form', 'Up to 5 daily times, e.g. breakfast, lunch, bed time', 'Today’s checklist – tap “mark taken”', 'Choose days for items you don’t take every day', 'A printable list for your doctor or pharmacist'],
  ['05_meds', '06_meds_list'], 'people-meds-supps', 'It is not easy to remember all your medications and supplements. Your doctor or pharmacist asks “What do you take?” – and your mind goes blank. I know, because I had that problem too – but not any more. Register all your medications and supplements in the TOMfit app and have the full list in your pocket, ready when you need it.'),
 ('exercises', 'exercises', 'Exercises', 'Walking is a great start, but muscles need a little more. TOMfit has 10 easy exercises with large, clear pictures.',
  ['Daily core: chair squats, calf raises, wall push-ups and more', 'Kettlebell exercises twice a week', 'Count your reps against your own starting point', 'A safety page before you begin', 'Go at your own pace – no levels, no pressure'],
  ['07_exercise_daily_core_chair_squats', '08_exercise_kettlebell_swing'], 'people-exercises', 'The TOMfit app invites you to choose at least 3 very basic daily core exercises – 10 minutes at most – and at least 3 kettlebell exercises, 2–3 times a week. Read the safety notes and tips before you start. Charts show your progress.'),
 ('settings', 'settings', 'Settings', 'Make TOMfit yours. Keep only the parts you need and set goals that suit you.',
  ['Switch off the parts you don’t need', 'Set your walking goals', 'Units set automatically – metric or imperial', 'Choose your kettlebell weight', 'All your data stays on your phone – back it up any time'],
  ['09_settings'], 'people-settings', 'The TOMfit app is very flexible – it is designed to work for you and with you. Adjust your baseline goals, switch off any part of the app you don’t use, set your kettlebell weight, and more.'),
]
tabs = ''.join(f'<button class="gbtn" role="tab" data-tab aria-controls="{i}" aria-selected="{"true" if x == 0 else "false"}">{E(l)}</button>' for x, (i, l, *_r) in enumerate(S))
secs = ''
for x, (i, l, t, intro, pts, imgs, ph, q) in enumerate(S):
    one = len(imgs) == 1
    secs += f'''<section class="sec" id="{i}" role="tabpanel" data-name="{E(t)}" data-imgs="{"|".join("/img/" + m + ".jpg" for m in imgs)}"{" hidden" if x else ""}>
    <div class="col">
      <h2>{E(t)}</h2>
      <p>{E(intro)}</p>
      <ul>{"".join(f"<li>{E(p)}</li>" for p in pts)}</ul>
    </div>
    <div class="shot">
      <div class="row">
        <button class="sbtn" data-d="-1" aria-label="Previous picture"{" disabled" if one else ""}>‹</button>
        <img src="/img/{imgs[0]}.jpg" alt="{E(t)} page of the TOMfit app" width="520" height="1127"{" loading=\"lazy\"" if x else ""}>
        <button class="sbtn" data-d="1" aria-label="Next picture"{" disabled" if one else ""}>›</button>
      </div>
      <span class="small" style="font-size:15px" data-no>Picture 1 of {len(imgs)}</span>
    </div>
    <div class="col">
      <img class="photo" src="/img/{ph}.jpg" alt="" width="1200" height="900" loading="lazy">
      <p class="pq">{E(q)}</p>
    </div>
  </section>
  '''
app = f'''<div class="band">Step-by-step guide to your TOMfit app</div>
<main id="main" class="pg" style="padding-top:40px;gap:34px">
  <div class="gp" role="tablist" aria-label="Parts of the app">{tabs}</div>
  {secs}
  <div class="appnav">
    <button class="btn o" data-prevtab>← Settings</button>
    <a class="btn y" href="/#testers">Become a tester – earn 1 year free</a>
    <button class="btn o" data-nexttab>Health →</button>
  </div>
</main>
'''
page('app.html', '/app', 'The TOMfit App – Walking, Health Numbers, Meds & Exercises',
     'See how TOMfit works: brisk-walk tracking, blood pressure and glucose logs, a medication checklist and 10 easy exercises. Your data stays on your phone.',
     'app', 'app', app)

# ------------------------------------------------------------------ INFO-BANK (panels + archives; articles live in assets/articles.js)
def src_main(n):
    return open(os.path.join(OUT, '_build', 'source', n + '.main.html'), encoding='utf-8').read()
IBCSS = f'<link rel="stylesheet" href="/assets/info-bank.css?v={V("assets/info-bank.css")}">\n'
IBJS = f'<script src="/assets/articles.js?v={V("assets/articles.js")}" defer></script>\n<script src="/assets/info-bank.js?v={V("assets/info-bank.js")}" defer></script>\n'
page('info-bank.html', '/info-bank', 'Free Health Guides for Over-50s | TOMfit Info-Bank',
     'Free plain-English guides for adults 50+: muscle loss, intermittent fasting, brisk walking, kettlebells, creatine, magnesium, vitamin B12 and D3 & K2.',
     'info', 'info', src_main('info-bank') + IBJS, IBCSS)
page('info-bank-archives.html', '/info-bank-archives', 'Info-Bank Archives | TOMfit',
     'Older TOMfit Info-Bank health guides for adults 50+, listed A to Z.',
     'info', 'info', src_main('info-bank-archives') + IBJS, IBCSS)

# ------------------------------------------------------------------ PUZZLES
FEATH = '<div class="feat">' + ''.join(f'<a class="fcard" href="/app#{a}"><div class="im"><img src="/img/{i}.jpg" alt="{n} page of the TOMfit app" width="520" height="1127" loading="lazy"></div><div class="tx"><span class="gtag">{n}</span><span>{t}</span></div></a>' for n, i, t, a in FEATS) + '</div>'
page('puzzles.html', '/puzzles', 'Free Puzzles for Over-50s | TOMfit Puzzles',
     'Free puzzles to train your brain and memory: sudoku, memory match and matching games for adults 50+, with a new puzzle every week from TOMfit.',
     'puzzles', 'puzzles', src_main('puzzles').replace('<!--FEAT-->', FEATH), f'<link rel="stylesheet" href="/assets/puzzles.css?v={V("assets/puzzles.css")}">\n')

# ------------------------------------------------------------------ TOOLS
TL = [('BMI Calculator', 'tool-bmi', 'bmi-calculator', 'Check whether your weight suits your height – in metric or imperial.', ['Your BMI with a clear colour scale', 'The healthy weight range for your height', 'Good-to-know notes for people over 50']),
      ('My Health Numbers', 'tool-health-numbers', 'my-health-numbers', 'Type in a result from a home test or lab report and see what it means.', ['Blood pressure, blood sugar, HbA1c, cholesterol and more', 'Vitamin D, vitamin B12, ketones, waist and resting pulse', 'UK / EU and US units']),
      ('Unit Converter', 'tool-unit-converter', 'unit-converter', 'Switch between metric and imperial / US units in one tap.', ['Weight, height, distance, speed and temperature', 'Food, kettlebell weights, blood sugar and cholesterol', 'Stones and pounds included'])]
tools = f'''<main id="main" class="pg">
  <div style="display:flex;flex-direction:column;gap:10px;max-width:760px">
    <div class="eyebrow">TOMfit · Tools</div>
    <h1 class="h2">Handy health tools – free, any time</h1>
    <p class="lead">Three simple tools to help you understand your numbers. Free of charge, no sign-up, and nothing you type leaves your device.</p>
  </div>
  <div class="g3 tls" style="gap:24px">{"".join(f'<div class="tcard"><div class="im"><img src="/img/{im}.jpg" alt="{t} preview" width="600" height="900" loading="lazy"></div><div class="tx"><span class="chip">Free</span><h2 style="margin:0;font-size:26px;line-height:1.15;font-weight:800;color:#0b3a85">{t}</h2><p>{d}</p><ul>{"".join(f"<li>{p}</li>" for p in pts)}</ul><a class="btn" href="/tools/{h}" target="_blank" rel="noopener">Open the tool</a></div></div>' for t, im, h, d, pts in TL)}</div>
  <div class="g3 trust">
    <div class="box"><b>Free, any time</b><div>No payment, no account and no sign-up. Use them as often as you like.</div></div>
    <div class="box"><b>Private</b><div>Your numbers stay on your phone or computer. Nothing is sent to us.</div></div>
    <div class="box"><b>Works on any device</b><div>Large, clear buttons on phone, tablet or computer.</div></div>
  </div>
  <p class="small" style="margin:-10px 0 0">The tools give general information only and are not medical advice. If a result worries you, talk to your doctor. <a href="/legal#health">Health notice</a></p>
</main>
'''
page('tools.html', '/tools', 'Free BMI Calculator & Health Tools for 50+ | TOMfit',
     'Free, private health tools: BMI calculator, a checker for blood pressure, blood sugar and cholesterol results, and a metric–imperial converter.',
     'tools', 'tools', tools)

# ------------------------------------------------------------------ SHOP
PR = [('Brisk walking and basic core exercises after 50', 'guide-book', 17, 'Walk more, build strength and make everyday movement easier. Brisk pace, weekly goals, three strength exercises and a simple combined weekly routine.', 'https://payhip.com/b/Y5toi'),
      ('Kettlebells after 50', 'guide-book', 12, 'A practical guide for your first month of strength training: health checks, buying your first kettlebell, three key moves and a simple progress log.', 'https://payhip.com/b/ijs0r')]
BUNDLE_URL = 'https://payhip.com/b/SBiJl'
CARDS = [('guide-bundle', 'Both guides: Brisk walking and Kettlebells after 50', 'Bundle', '', 'Brisk walk, basic core &amp; kettlebells after 50', '£4.95', '$5.95 · both guides', BUNDLE_URL),
         ('guide-walking', 'First page of Brisk walking and basic core exercises after 50', 'Exercises', ' b', 'Brisk walking and basic core exercises after 50', '£2.95', '$3.95 · 17 pages', PR[0][4]),
         ('guide-kettlebells', 'First page of Kettlebells after 50', 'Exercises', ' b', 'Kettlebells after 50', '£2.95', '$3.95 · 12 pages', PR[1][4])]
shop = f'''<main id="main" class="pg">
  <div class="shophd">
    <div>
      <div class="eyebrow">TOMfit shop · printable guides</div>
      <h1 class="h2">Detailed guides you can keep and print</h1>
      <p class="lead">Clear, step-by-step PDF guides for adults over 50 – written in plain language, with pictures, plans and checklists.</p>
    </div>
    <a class="deal" href="{BUNDLE_URL}" target="_blank" rel="noopener" style="display:block;text-decoration:none"><div class="t">Both guides</div><div class="p">£4.95 · $5.95</div><div class="s">instead of £5.90 · $7.90</div><div class="t" style="margin-top:6px;color:#0b4ba8">Buy both guides</div></a>
  </div>
  <div class="sg" aria-label="Guides">{"".join(f'<div class="sc"><img src="/img/{im}.jpg" alt="{E(al)}" width="520" height="736" loading="lazy"><span class="chip{cc}">{ch}</span><h2>{t}</h2><div class="pr">{pr} <small>{sm}</small></div><a class="bn" href="{u}" target="_blank" rel="noopener">Buy now</a></div>' for im, al, ch, cc, t, pr, sm, u in CARDS)}</div>
  <p class="small" style="margin:14px 0 6px">All guides are printable PDFs with instant download. More guides are coming soon.</p>
  <div class="g2 trust">
    <div class="box"><b>Instant download</b><div>Your PDF is ready straight after payment, and the link is emailed to you too.</div></div>
    <div class="box"><b>Secure payment</b><div>Card or PayPal through Payhip, our secure checkout.</div></div>
  </div>
  <p class="small" style="margin:-10px 0 0">{CURRENCY}</p>
  <p class="small" style="margin:-10px 0 0;font-size:15px">Digital downloads cannot be returned once delivered. If your PDF does not arrive or will not open, we will fix it or refund you. <a href="/legal#terms">Terms of sale</a></p>
</main>
'''
page('shop.html', '/shop', 'Walking & Kettlebell Guides for 50+ (PDF) | TOMfit Shop',
     'Printable step-by-step guides for adults over 50: brisk walking with core exercises, and kettlebells for beginners. £2.95 each, or both for £4.95.',
     'shop', 'shop', shop, f'<link rel="stylesheet" href="/assets/shop.css?v={V("assets/shop.css")}">\n')

# ------------------------------------------------------------------ LEGAL (body copied from the approved canvas)
import re
src = open(os.path.join(OUT, '_build', 'source', 'Legal.dc.html')).read()
body = re.search(r'<main class="lg"[^>]*>(.*?)</main>', src, re.S).group(1)
body = body.replace('for one article, or any 2 for £4.95 / $5.95.', 'for one guide, or both guides for £4.95 / $5.95.')
body = re.sub(r'<section id="(\w+)" style="[^"]*">', r'<section id="\1">', body)
body = body.replace('<h2 style="margin: 6px 0 4px; font-size: 38px; font-weight: 800; letter-spacing: -0.02em">', '<h2>')
body = body.replace('<p style="color: #33496b">', '<p class="date">')
body = re.sub(r'<div style="font-size: 14px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #1f9d4c">', '<div class="eyebrow g">', body)
body = re.sub(r'<div style="font-size: 14px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #0b4ba8">', '<div class="eyebrow">', body)
body = body.replace('<h2>Important health notice</h2>', '<h1 style="margin:6px 0 4px;font-size:38px;font-weight:800;letter-spacing:-.02em">Important health notice</h1>')
assert 'style="' not in body.replace('style="margin-top: 10px"', '').replace('style="margin:6px 0 4px;font-size:38px;font-weight:800;letter-spacing:-.02em"', ''), re.findall(r'style="[^"]*"', body)
page('legal.html', '/legal', 'Health Notice, Privacy & Terms | TOMfit',
     "TOMfit's health notice, privacy policy and terms of sale. Your app data stays on your phone. General information only – not medical advice.",
     'none', 'none', f'<main id="main" class="lg">{body}</main>\n')

# ------------------------------------------------------------------ 404
page('404.html', '/404', 'Page not found | TOMfit', 'This page does not exist on tomfit.app.', 'none', 'none',
     '''<main id="main" class="pg" style="text-align:center;align-items:center"><h1 class="h2">Sorry – that page is not here</h1><p class="lead">It may have moved. Try the menu above, or go back to the <a href="/">home page</a>.</p></main>\n''',
     '<meta name="robots" content="noindex">\n')

# ------------------------------------------------------------------ robots, sitemap, headers
open(os.path.join(OUT, '_redirects'), 'w').write('/fun-4u /puzzles 301\n/fun-4u.html /puzzles 301\n')
open(os.path.join(OUT, 'robots.txt'), 'w').write(f'User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n')
urls = ['/', '/app', '/info-bank', '/tools', '/shop', '/puzzles', '/legal'] + ['/tools/' + t[2] for t in TL]
open(os.path.join(OUT, 'sitemap.xml'), 'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    ''.join(f'  <url><loc>{SITE}{u}</loc><lastmod>2026-11-16</lastmod></url>\n' for u in urls) + '</urlset>\n')
open(os.path.join(OUT, '_headers'), 'w').write('''/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()

/img/*
  Cache-Control: public, max-age=3600

/assets/*
  Cache-Control: public, max-age=3600

/articles/*
  Cache-Control: public, max-age=86400
''')
print('built')
