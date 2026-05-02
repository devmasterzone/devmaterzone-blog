/* ===== DevMasterZone – App JS ===== */
'use strict';

const App = (() => {
  // ── State
  const S = {
    cat: 'all', q: '', pg: 1, perPg: 6,
    likes: JSON.parse(localStorage.getItem('dmz_l')||'[]'),
    saves: JSON.parse(localStorage.getItem('dmz_s')||'[]'),
  };

  // ── Init
  function init() {
    setTimeout(()=>{ document.getElementById('loader')?.classList.add('gone'); }, 1300);
    const th = localStorage.getItem('dmz_th')||'dark';
    setTheme(th);
    setupNav();
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('hashchange', route);
    document.getElementById('btt')?.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));
    route();
    revealObs();
  }

  // ── Theme
  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    localStorage.setItem('dmz_th', t);
    ['thIcon','thIconMob'].forEach(id=>{
      const el = document.getElementById(id);
      if(el) el.className = t==='dark'?'fas fa-sun':'fas fa-moon';
    });
  }
  function toggleTheme(){
    setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
  }

  // ── Nav
  function setupNav() {
    document.getElementById('thBtn')?.addEventListener('click', toggleTheme);
    document.getElementById('thBtnM')?.addEventListener('click', toggleTheme);
    const ham = document.getElementById('ham');
    const menu = document.getElementById('navLinks');
    ham?.addEventListener('click', ()=>{ ham.classList.toggle('x'); menu?.classList.toggle('open'); });
    document.querySelectorAll('.nl').forEach(l=>l.addEventListener('click',()=>{ ham?.classList.remove('x'); menu?.classList.remove('open'); }));
  }

  function onScroll() {
    const y = window.scrollY;
    document.getElementById('nav')?.classList.toggle('stuck', y>60);
    document.getElementById('btt')?.classList.toggle('on', y>400);
    updateProg();
    setActiveNav();
  }

  function updateProg() {
    const el = document.getElementById('prog');
    if(!el) return;
    const d = document.body.scrollHeight - window.innerHeight;
    el.style.width = (d>0?(window.scrollY/d*100):0)+'%';
  }

  function setActiveNav() {
    const h = location.hash||'#home';
    document.querySelectorAll('.nl').forEach(l=>l.classList.toggle('on', l.getAttribute('href')===h));
  }

  // ── Router
  function route() {
    const h = location.hash||'#home';
    window.scrollTo(0,0);
    document.querySelectorAll('.page').forEach(p=>p.classList.add('hide'));
    document.querySelectorAll('.nl').forEach(l=>l.classList.remove('on'));

    if(h.startsWith('#post/')) {
      const slug = h.replace('#post/','');
      const post = DMZ.get(slug);
      if(post){ renderPost(post); show('pg-post'); }
      else show('pg-404');
    } else if(h==='#blogs'||h.startsWith('#cat/')) {
      const c = h.startsWith('#cat/')?h.replace('#cat/',''):'all';
      S.cat=c; S.q=''; S.pg=1;
      renderBlogs();
      show('pg-blogs');
    } else if(h==='#categories') {
      renderCats();
      show('pg-cats');
    } else if(h==='#about') {
      show('pg-about');
    } else if(h==='#contact') {
      show('pg-contact');
      setupContact();
    } else if(h==='#login') {
      renderAuth('login');
      show('pg-auth');
    } else if(h==='#register') {
      renderAuth('register');
      show('pg-auth');
    } else if(h==='#write') {
      show('pg-write');
      setupWrite();
    } else {
      renderHome();
      show('pg-home');
    }
    setActiveNav();
    setTimeout(revealObs,50);
  }

  function show(id){ document.getElementById(id)?.classList.remove('hide'); }

  // ── Home
  function renderHome() {
    renderFeatured();
    renderLatest();
    renderCatStrip();
  }

  function renderCatStrip() {
    const el = document.getElementById('cat-strip');
    if(!el) return;
    el.innerHTML = DMZ.cats.map(c=>`
      <a href="#cat/${c.id}" class="chip">
        <i class="${c.icon}" style="color:${c.color}"></i>
        <span>${c.name}</span>
        <span class="chip-n">${c.count}</span>
      </a>`).join('');
  }

  function renderFeatured() {
    const el = document.getElementById('featured');
    if(!el) return;
    const [p1,p2,p3] = DMZ.featured();
    el.innerHTML = `
      <a href="#post/${p1.slug}" class="feat-lg rv">
        <div class="fl-img"><i class="${p1.icon}"></i></div>
        <div class="fl-body">
          <span class="bcard-cat">${p1.catName}</span>
          <div class="fl-t">${p1.title}</div>
          <p class="fl-d">${p1.excerpt}</p>
          <div class="bcard-meta">
            <span><i class="fas fa-user"></i> ${p1.author}</span>
            <span class="sep">·</span>
            <span><i class="fas fa-calendar"></i> ${p1.date}</span>
            <span class="sep">·</span>
            <span><i class="fas fa-clock"></i> ${p1.rt}</span>
          </div>
        </div>
      </a>
      ${[p2,p3].map(p=>`
        <a href="#post/${p.slug}" class="feat-sm rv">
          <div class="fs-img"><i class="${p.icon}"></i></div>
          <div class="fs-body">
            <span class="bcard-cat">${p.catName}</span>
            <div class="fs-t">${p.title}</div>
            <div class="bcard-meta" style="margin-top:.5rem">
              <span><i class="fas fa-clock"></i> ${p.rt}</span>
              <span class="sep">·</span>
              <span><i class="fas fa-calendar"></i> ${p.date}</span>
            </div>
          </div>
        </a>`).join('')}`;
  }

  function renderLatest() {
    const el = document.getElementById('latest');
    if(!el) return;
    el.innerHTML = DMZ.recent(6).map(p=>card(p)).join('');
    setupCardEvents(el);
  }

  // ── Blogs
  function renderBlogs() {
    const el = document.getElementById('pg-blogs');
    if(!el) return;
    el.innerHTML = `
    <div class="wrap" style="padding-top:calc(var(--nav)+2.5rem);padding-bottom:3.5rem">
      <div class="breadcrumb"><a href="#home">Home</a><i class="fas fa-chevron-right"></i><span>Blogs</span></div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;margin-bottom:2rem">
        <div>
          <div class="sec-tag">All Articles</div>
          <h1 class="sec-title">Read & <span class="gold">Learn</span></h1>
          <p class="sec-sub">${DMZ.posts.length}+ articles on web development</p>
        </div>
      </div>
      <div class="csl">
        <div>
          <div class="sbox" style="max-width:350px;margin-bottom:1.1rem">
            <i class="fas fa-search"></i>
            <input type="text" class="sinput" id="bSearch" placeholder="Search articles…" />
          </div>
          <div class="ftabs" id="catTabs" style="margin-bottom:1.4rem"></div>
          <div class="grid3" id="bGrid"></div>
          <div id="bPages"></div>
        </div>
        ${sidebar()}
      </div>
    </div>`;
    buildCatTabs();
    applyFilters();
    document.getElementById('bSearch')?.addEventListener('input', e=>{ S.q=e.target.value; S.pg=1; applyFilters(); });
    document.getElementById('pg-blogs').querySelector('.sidebar')?.querySelectorAll('.catitem').forEach(el=>{
      el.addEventListener('click', ()=>{ S.cat=el.dataset.cat; S.pg=1; buildCatTabs(); applyFilters(); });
    });
  }

  function buildCatTabs() {
    const el = document.getElementById('catTabs');
    if(!el) return;
    const all = [{id:'all',name:'All'},...DMZ.cats];
    el.innerHTML = all.map(c=>`<button class="tag ${S.cat===c.id?'on':''}" data-cat="${c.id}">${c.name}</button>`).join('');
    el.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{ S.cat=b.dataset.cat; S.pg=1; buildCatTabs(); applyFilters(); }));
  }

  function applyFilters() {
    let posts = DMZ.posts;
    if(S.cat!=='all') posts = posts.filter(p=>p.cat===S.cat);
    if(S.q) posts = DMZ.search(S.q).filter(p=>S.cat==='all'||p.cat===S.cat);
    const total=posts.length, pages=Math.ceil(total/S.perPg);
    const slice = posts.slice((S.pg-1)*S.perPg, S.pg*S.perPg);
    const grid = document.getElementById('bGrid');
    if(grid) {
      grid.innerHTML = slice.length ? slice.map(p=>card(p)).join('') :
        `<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:3rem">
           <i class="fas fa-search" style="font-size:2.5rem;opacity:.25;display:block;margin-bottom:1rem"></i>
           No articles found. Try another search.
         </div>`;
      setupCardEvents(grid);
    }
    buildPages(pages);
    setTimeout(revealObs,30);
  }

  function buildPages(total) {
    const el = document.getElementById('bPages');
    if(!el||total<=1){if(el)el.innerHTML='';return;}
    let h='<div class="pages">';
    h+=`<button class="pb" id="pPrev"><i class="fas fa-chevron-left"></i></button>`;
    for(let i=1;i<=total;i++){
      if(i===1||i===total||Math.abs(i-S.pg)<=1) h+=`<button class="pb ${i===S.pg?'on':''}" data-p="${i}">${i}</button>`;
      else if(Math.abs(i-S.pg)===2) h+=`<span class="pb dot">…</span>`;
    }
    h+=`<button class="pb" id="pNext"><i class="fas fa-chevron-right"></i></button>`;
    h+='</div>';
    el.innerHTML=h;
    el.querySelectorAll('[data-p]').forEach(b=>b.addEventListener('click',()=>{ S.pg=+b.dataset.p; applyFilters(); window.scrollTo({top:0,behavior:'smooth'}); }));
    document.getElementById('pPrev')?.addEventListener('click',()=>{ if(S.pg>1){S.pg--;applyFilters();} });
    document.getElementById('pNext')?.addEventListener('click',()=>{ if(S.pg<total){S.pg++;applyFilters();} });
  }

  // ── Post Detail
  function renderPost(post) {
    const el = document.getElementById('pg-post');
    if(!el) return;
    const {prev,next} = DMZ.prevNext(post.id);
    const related = DMZ.related(post);
    const liked = S.likes.includes(post.id);
    const saved = S.saves.includes(post.id);
    el.innerHTML = `
    <div style="padding-top:var(--nav)">
      <div class="det-banner">
        <div class="det-bg-icon"><i class="${post.icon}"></i></div>
        <div class="wrap det-head">
          <div class="breadcrumb">
            <a href="#home">Home</a><i class="fas fa-chevron-right"></i>
            <a href="#blogs">Blogs</a><i class="fas fa-chevron-right"></i>
            <a href="#cat/${post.cat}">${post.catName}</a>
          </div>
          <span class="bcard-cat">${post.catName}</span>
          <h1 class="det-title">${post.title}</h1>
          <div class="bcard-meta" style="font-size:.85rem;gap:.9rem;margin-bottom:1.3rem">
            <span><i class="fas fa-user"></i> ${post.author}</span>
            <span><i class="fas fa-calendar"></i> ${post.date}</span>
            <span><i class="fas fa-clock"></i> ${post.rt}</span>
            <span><i class="fas fa-eye"></i> ${post.views.toLocaleString()} views</span>
          </div>
          <div class="det-acts">
            <button class="btn btn-ghost btn-sm liked-btn ${liked?'on':''}" data-id="${post.id}">
              <i class="${liked?'fas':'far'} fa-heart"></i> ${liked?post.likes+1:post.likes}
            </button>
            <button class="btn btn-ghost btn-sm saved-btn ${saved?'on':''}" data-id="${post.id}">
              <i class="${saved?'fas':'far'} fa-bookmark"></i> ${saved?'Saved':'Save'}
            </button>
            <div class="share-row">
              <span style="font-size:.76rem;color:var(--muted)">Share:</span>
              <a href="https://twitter.com/share?text=${encodeURIComponent(post.title)}" target="_blank" class="btn btn-ghost btn-sm"><i class="fab fa-twitter"></i></a>
              <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(location.href)}" target="_blank" class="btn btn-ghost btn-sm"><i class="fab fa-linkedin-in"></i></a>
              <button class="btn btn-ghost btn-sm" onclick="navigator.clipboard.writeText(location.href);App.toast('Link copied!','ok')"><i class="fas fa-link"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div class="wrap" style="padding-top:2.3rem;padding-bottom:3rem">
        <div class="csl">
          <div>
            <article class="prose">${post.content}</article>
            <div style="margin-top:1.8rem">
              <strong style="font-size:.85rem">Tags:</strong>
              <div class="ftabs" style="margin-top:.5rem">${post.tags.map(t=>`<a href="#blogs" class="tag">#${t}</a>`).join('')}</div>
            </div>
            <div class="author-box">
              <div class="author-av"><i class="fas fa-user-tie"></i></div>
              <div class="author-info">
                <div class="a-row">
                  <div>
                    <div style="font-size:.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em">Written by</div>
                    <div style="font-family:var(--ff-head);font-size:1.05rem;font-weight:700;margin-top:.15rem">${post.author}</div>
                    <div style="font-size:.85rem;color:var(--gold)">${post.role}</div>
                  </div>
                  <div class="f-social">
                    <a href="#" class="fsoc"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="fsoc"><i class="fab fa-linkedin-in"></i></a>
                    <a href="#" class="fsoc"><i class="fab fa-github"></i></a>
                  </div>
                </div>
                <p style="font-size:.85rem;color:var(--muted);margin-top:.7rem;line-height:1.7">
                  Frontend Developer and Web Development Educator. Sharing practical knowledge about modern web technologies to help developers grow their skills.
                </p>
              </div>
            </div>
            <div class="pn-nav">
              ${prev?`<a href="#post/${prev.slug}" class="pn-card">
                <span class="pn-lbl"><i class="fas fa-arrow-left"></i> Previous</span>
                <span class="pn-t">${prev.title}</span>
              </a>`:'<div></div>'}
              ${next?`<a href="#post/${next.slug}" class="pn-card pn-r">
                <span class="pn-lbl">Next <i class="fas fa-arrow-right"></i></span>
                <span class="pn-t">${next.title}</span>
              </a>`:'<div></div>'}
            </div>
            <div class="cmts">
              <h3 style="font-family:var(--ff-head);font-size:1.2rem;font-weight:700;margin-bottom:1.3rem">
                Comments <span style="font-size:1rem;font-weight:400;color:var(--muted)">(3)</span>
              </h3>
              ${staticCmts()}
              <h4 style="font-family:var(--ff-head);font-size:1rem;font-weight:700;margin:1.8rem 0 1rem">Leave a Comment</h4>
              <form class="cmt-form" id="cmtForm">
                <div class="frow">
                  <div class="fg"><label>Name *</label><input class="fc" id="cN" placeholder="Your name" required/><span class="ferr" id="cNe"></span></div>
                  <div class="fg"><label>Email *</label><input type="email" class="fc" id="cE" placeholder="your@email.com" required/><span class="ferr" id="cEe"></span></div>
                </div>
                <div class="fg"><label>Comment *</label><textarea class="fc" id="cM" rows="4" placeholder="Share your thoughts…" required></textarea><span class="ferr" id="cMe"></span></div>
                <button type="submit" class="btn btn-gold"><i class="fas fa-paper-plane"></i> Post Comment</button>
              </form>
            </div>
          </div>
          ${sidebar()}
        </div>
        ${related.length?`
        <div style="margin-top:3rem">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
            <h3 class="sec-title">Related <span class="gold">Articles</span></h3>
          </div>
          <div class="grid3">${related.map(p=>card(p)).join('')}</div>
        </div>`:''}
      </div>
    </div>`;

    // Like
    el.querySelector('.liked-btn')?.addEventListener('click', function(){
      const id=+this.dataset.id, p=DMZ.byId(id);
      if(S.likes.includes(id)){S.likes=S.likes.filter(x=>x!==id);this.innerHTML=`<i class="far fa-heart"></i> ${p.likes}`;this.classList.remove('on');}
      else{S.likes.push(id);this.innerHTML=`<i class="fas fa-heart"></i> ${p.likes+1}`;this.classList.add('on');toast('Added to likes!','ok');}
      localStorage.setItem('dmz_l',JSON.stringify(S.likes));
    });
    // Save
    el.querySelector('.saved-btn')?.addEventListener('click', function(){
      const id=+this.dataset.id;
      if(S.saves.includes(id)){S.saves=S.saves.filter(x=>x!==id);this.innerHTML=`<i class="far fa-bookmark"></i> Save`;this.classList.remove('on');toast('Bookmark removed','inf');}
      else{S.saves.push(id);this.innerHTML=`<i class="fas fa-bookmark"></i> Saved`;this.classList.add('on');toast('Article bookmarked!','ok');}
      localStorage.setItem('dmz_s',JSON.stringify(S.saves));
    });
    // Comment
    el.querySelector('#cmtForm')?.addEventListener('submit', e=>{
      e.preventDefault();
      let ok=true;
      [['cN','cNe',v=>v.trim().length>=2?'':'Name required'],
       ['cE','cEe',v=>/\S+@\S+\.\S+/.test(v)?'':'Valid email required'],
       ['cM','cMe',v=>v.trim().length>=10?'':'Comment too short']
      ].forEach(([fi,ei,fn])=>{
        const msg=fn(document.getElementById(fi).value);
        document.getElementById(ei).textContent=msg;
        if(msg)ok=false;
      });
      if(!ok)return;
      toast('Comment submitted! Under review.','ok');
      e.target.reset();
    });
    setupCardEvents(el);
  }

  function staticCmts() {
    return [{name:'Alex Kumar',date:'Apr 30, 2026',text:'Excellent article! Very well explained. Bookmarked for reference.'},
      {name:'Priya Singh',date:'Apr 29, 2026',text:'This helped me a lot in my project. Thank you DevMasterZone!'},
      {name:'Rahul Dev',date:'Apr 28, 2026',text:'Can you write a follow-up on advanced topics? Would love more!'}
    ].map(c=>`
      <div class="cmt">
        <div class="cmt-av"><i class="fas fa-user"></i></div>
        <div style="flex:1">
          <div class="cmt-row"><strong>${c.name}</strong><span>${c.date}</span></div>
          <p class="cmt-text">${c.text}</p>
          <button class="btn btn-ghost btn-sm" style="margin-top:.4rem;padding:3px 9px;font-size:.73rem"><i class="far fa-thumbs-up"></i> Like</button>
        </div>
      </div>`).join('');
  }

  // ── Categories
  function renderCats() {
    const el = document.getElementById('pg-cats');
    if(!el) return;
    el.innerHTML = `
    <div class="wrap" style="padding-top:calc(var(--nav)+3rem);padding-bottom:4rem">
      <div class="center" style="margin-bottom:2.8rem">
        <div class="sec-tag">Browse by Topic</div>
        <h1 class="sec-title">All <span class="gold">Categories</span></h1>
        <p class="sec-sub">Find articles by your favourite technology</p>
      </div>
      <div class="cats-grid">
        ${DMZ.cats.map(c=>`
        <a href="#cat/${c.id}" class="cat-card rv">
          <div class="cc-icon" style="color:${c.color};background:${c.color}18"><i class="${c.icon}"></i></div>
          <h3>${c.name}</h3>
          <p>${c.count} Articles</p>
          <span class="cc-arr"><i class="fas fa-arrow-right"></i></span>
        </a>`).join('')}
      </div>
    </div>`;
  }

  // ── Auth
  function renderAuth(mode) {
    const el = document.getElementById('auth-inner');
    if(!el) return;
    const login = mode==='login';
    el.innerHTML = `
    <div class="auth-box">
      <div style="text-align:center;margin-bottom:1.8rem">
        <a href="#home" style="font-family:var(--ff-head);font-size:1.4rem;font-weight:700;display:inline-block;margin-bottom:.9rem">
          <span style="color:var(--gold)">DevMaster</span><span>Zone</span>
        </a>
        <h2 style="font-family:var(--ff-head);font-size:1.5rem;font-weight:700">${login?'Welcome Back':'Create Account'}</h2>
        <p style="color:var(--muted);font-size:.85rem;margin-top:.25rem">${login?'Sign in to your account':'Join our developer community'}</p>
      </div>
      <form id="authForm">
        ${!login?`<div class="fg"><label>Full Name</label><input class="fc" placeholder="John Doe" required /></div>`:''}
        <div class="fg"><label>Email</label><input type="email" class="fc" placeholder="john@example.com" required /></div>
        <div class="fg"><label>Password</label><input type="password" class="fc" placeholder="••••••••" required /></div>
        ${!login?`<div class="fg"><label>Confirm Password</label><input type="password" class="fc" placeholder="••••••••" required /></div>`:''}
        ${login?`<div style="text-align:right;margin-bottom:1rem;margin-top:-.5rem"><a href="#" style="font-size:.8rem;color:var(--gold)">Forgot password?</a></div>`:''}
        <button type="submit" class="btn btn-gold btn-block btn-lg">${login?'<i class="fas fa-sign-in-alt"></i> Sign In':'<i class="fas fa-user-plus"></i> Create Account'}</button>
        <p style="text-align:center;margin-top:1.1rem;font-size:.85rem;color:var(--muted)">
          ${login?`No account? <a href="#register" style="color:var(--gold)">Register</a>`:`Have an account? <a href="#login" style="color:var(--gold)">Sign In</a>`}
        </p>
      </form>
    </div>`;
    el.querySelector('#authForm')?.addEventListener('submit', e=>{ e.preventDefault(); toast(login?'Login coming soon!':'Register coming soon!','inf'); });
  }

  // ── Contact
  function setupContact() {
    document.getElementById('contactForm')?.addEventListener('submit', e=>{
      e.preventDefault();
      const fields=[
        ['cfn','cfne',v=>v.trim().length>=2?'':'Name required'],
        ['cfe','cfee',v=>/\S+@\S+\.\S+/.test(v)?'':'Valid email required'],
        ['cfs','cfse',v=>v.trim().length>=3?'':'Subject required'],
        ['cfm','cfme',v=>v.trim().length>=10?'':'Message too short'],
      ];
      let ok=true;
      fields.forEach(([fi,ei,fn])=>{
        const el=document.getElementById(fi),ee=document.getElementById(ei);
        if(!el||!ee)return;
        const msg=fn(el.value);ee.textContent=msg;el.classList.toggle('err',!!msg);if(msg)ok=false;
      });
      if(!ok)return;
      const btn=document.getElementById('cBtn');
      if(btn){btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending…';}
      setTimeout(()=>{
        if(btn){btn.disabled=false;btn.innerHTML='<i class="fas fa-paper-plane"></i> Send Message';}
        toast("Message sent! We'll reply within 24 hours.",'ok');
        e.target.reset();
      },1800);
    });
  }

  // ── Write
  function setupWrite() {
    document.getElementById('publishBtn')?.addEventListener('click',()=>toast('Publishing feature coming soon!','inf'));
  }

  // ── Sidebar
  function sidebar() {
    const rec=DMZ.recent(4), pop=DMZ.popular(4), tags=DMZ.tags().slice(0,15);
    return `<aside class="sidebar">
      <div class="sc">
        <div class="st">Search</div>
        <div class="sbox"><i class="fas fa-search"></i><input type="text" class="sinput" placeholder="Search articles…" id="sbSearch"/></div>
      </div>
      <div class="sc">
        <div class="st">Categories</div>
        ${DMZ.cats.map(c=>`<a href="#cat/${c.id}" class="catitem" data-cat="${c.id}"><span><i class="${c.icon}" style="color:${c.color};margin-right:7px;width:15px"></i>${c.name}</span><span class="catbadge">${c.count}</span></a>`).join('')}
      </div>
      <div class="sc">
        <div class="st">Recent Posts</div>
        ${rec.map(p=>`<a href="#post/${p.slug}" class="sp"><div class="sp-icon"><i class="${p.icon}"></i></div><div><div class="sp-title">${p.title}</div><div class="sp-date"><i class="fas fa-calendar" style="margin-right:3px;font-size:.65rem"></i>${p.date}</div></div></a>`).join('')}
      </div>
      <div class="sc">
        <div class="st">Popular Posts</div>
        ${pop.map(p=>`<a href="#post/${p.slug}" class="sp"><div class="sp-icon"><i class="${p.icon}"></i></div><div><div class="sp-title">${p.title}</div><div class="sp-date"><i class="fas fa-eye" style="margin-right:3px;font-size:.65rem"></i>${p.views.toLocaleString()} views</div></div></a>`).join('')}
      </div>
      <div class="sc">
        <div class="st">Popular Tags</div>
        <div class="ftabs">${tags.map(t=>`<a href="#blogs" class="tag">#${t}</a>`).join('')}</div>
      </div>
      <div class="sc" style="background:linear-gradient(135deg,rgba(240,165,0,.07),rgba(74,158,255,.05));border-color:rgba(240,165,0,.18)">
        <div class="st">Newsletter</div>
        <p style="font-size:.8rem;color:var(--muted);margin-bottom:.9rem">Get latest articles delivered weekly. No spam.</p>
        <div class="nlform">
          <input type="email" class="nlinput" placeholder="your@email.com"/>
          <button class="btn btn-gold btn-sm btn-block" onclick="App.toast('Subscribed!','ok')"><i class="fas fa-envelope"></i> Subscribe</button>
        </div>
      </div>
    </aside>`;
  }

  // ── Card
  function card(p) {
    const liked=S.likes.includes(p.id), saved=S.saves.includes(p.id);
    return `
    <article class="bcard rv">
      <a href="#post/${p.slug}"><div class="bcard-img"><i class="${p.icon}"></i></div></a>
      <div class="bcard-body">
        <span class="bcard-cat">${p.catName}</span>
        <a href="#post/${p.slug}"><h3 class="bcard-title">${p.title}</h3></a>
        <p class="bcard-desc">${p.excerpt}</p>
        <div class="bcard-meta">
          <span><i class="fas fa-user"></i> ${p.author}</span>
          <span class="sep">·</span>
          <span><i class="fas fa-calendar"></i> ${p.date}</span>
          <span class="sep">·</span>
          <span><i class="fas fa-clock"></i> ${p.rt}</span>
        </div>
        <div class="bcard-foot">
          <a href="#post/${p.slug}" class="rm">Read More <i class="fas fa-arrow-right"></i></a>
          <div class="stats">
            <span class="lk-t ${liked?'liked':''}" data-id="${p.id}"><i class="${liked?'fas':'far'} fa-heart"></i> ${liked?p.likes+1:p.likes}</span>
            <span class="sv-t ${saved?'saved':''}" data-id="${p.id}"><i class="${saved?'fas':'far'} fa-bookmark"></i></span>
          </div>
        </div>
      </div>
    </article>`;
  }

  function setupCardEvents(root) {
    root.querySelectorAll('.lk-t').forEach(el=>{
      el.addEventListener('click', e=>{ e.preventDefault();
        const id=+el.dataset.id, p=DMZ.byId(id);
        if(S.likes.includes(id)){S.likes=S.likes.filter(x=>x!==id);el.innerHTML=`<i class="far fa-heart"></i> ${p.likes}`;el.classList.remove('liked');}
        else{S.likes.push(id);el.innerHTML=`<i class="fas fa-heart"></i> ${p.likes+1}`;el.classList.add('liked');toast('Liked!','ok');}
        localStorage.setItem('dmz_l',JSON.stringify(S.likes));
      });
    });
    root.querySelectorAll('.sv-t').forEach(el=>{
      el.addEventListener('click', e=>{ e.preventDefault();
        const id=+el.dataset.id;
        if(S.saves.includes(id)){S.saves=S.saves.filter(x=>x!==id);el.innerHTML=`<i class="far fa-bookmark"></i>`;el.classList.remove('saved');toast('Removed','inf');}
        else{S.saves.push(id);el.innerHTML=`<i class="fas fa-bookmark"></i>`;el.classList.add('saved');toast('Bookmarked!','ok');}
        localStorage.setItem('dmz_s',JSON.stringify(S.saves));
      });
    });
  }

  // ── Reveal
  function revealObs() {
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target);} });
    },{threshold:.08,rootMargin:'0px 0px -30px 0px'});
    document.querySelectorAll('.rv:not(.vis)').forEach(el=>obs.observe(el));
  }

  // ── Toast
  function toast(msg, type='ok') {
    const el = document.getElementById('toast');
    if(!el) return;
    el.textContent = msg;
    el.className = `on ${type}`;
    clearTimeout(el._t);
    el._t = setTimeout(()=>el.className='', 3400);
  }

  return { init, toast };
})();

document.addEventListener('DOMContentLoaded', ()=>App.init());
