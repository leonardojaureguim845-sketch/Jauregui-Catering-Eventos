(() => {
'use strict';
const PHONE='59177523256';
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const state={dishes:[],category:'Todos',search:'',favorites:new Set(JSON.parse(localStorage.getItem('jauregui-favorites')||'[]')),selected:new Map(),showFavorites:false};
const toast=(msg)=>{const el=$('#toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2200)};
const safe=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function renderCategories(){const cats=['Todos',...new Set(state.dishes.map(d=>d.category))];$('#categoryFilters').innerHTML=cats.map(c=>`<button class="category-chip ${state.category===c?'active':''}" type="button" data-category="${safe(c)}">${safe(c)}</button>`).join('')}
function renderDishes(){const grid=$('#dishGrid');let list=state.dishes.filter(d=>(state.category==='Todos'||d.category===state.category)&&(!state.showFavorites||state.favorites.has(d.id))&&(`${d.name} ${d.description} ${d.category}`.toLocaleLowerCase('es').includes(state.search)));
$('#resultCount').textContent=`${list.length} ${list.length===1?'plato encontrado':'platos encontrados'}`;$('#favoriteCount').textContent=state.favorites.size;
if(!list.length){grid.innerHTML='<div class="empty-state">No encontramos platos con esos criterios. Prueba otra búsqueda o categoría.</div>';return}
grid.innerHTML=list.map(d=>`<article class="dish-card"><div class="dish-image"><img src="assets/images/${encodeURIComponent(d.image)}" alt="${safe(d.name)}" loading="lazy" decoding="async"><button class="favorite-button ${state.favorites.has(d.id)?'active':''}" data-favorite="${d.id}" aria-label="${state.favorites.has(d.id)?'Quitar de':'Agregar a'} favoritos">${state.favorites.has(d.id)?'♥':'♡'}</button></div><div class="dish-info"><span class="dish-category">${safe(d.category)}</span><h3>${safe(d.name)}</h3><p>${safe(d.description)}</p><div class="dish-bottom"><b>Cotizar con el responsable</b><div class="quantity-control"><button type="button" data-minus="${d.id}" aria-label="Restar ${safe(d.name)}">−</button><span>${state.selected.get(d.id)||0}</span><button type="button" data-add="${d.id}" aria-label="Agregar ${safe(d.name)}">+</button></div></div></div></article>`).join('');updateSummary()}
function updateSummary(){const count=[...state.selected.values()].reduce((a,b)=>a+b,0);$('#selectedCount').textContent=count;const guests=Number($('#quoteForm [name=guests]').value)||0;$('#guestSummary').textContent=guests;}
function toggleDish(id){state.selected.set(id,(state.selected.get(id)||0)+1);renderDishes();toast('Cantidad actualizada') }
function decrementDish(id){const qty=state.selected.get(id)||0;if(qty<=1)state.selected.delete(id);else state.selected.set(id,qty-1);renderDishes()}
function whatsappUrl(message){return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`}
function sendQuote(e){
e.preventDefault();
const form=e.currentTarget;
if(!form.reportValidity())return;
const data=new FormData(form);
const name=String(data.get('name')).trim();
const guests=Math.max(1,Number(data.get('guests'))||1);
const picked=[...state.selected.entries()].map(([id,qty])=>{
 const d=state.dishes.find(x=>x.id===id);
 return d?`  - ${d.name}: ${qty} porciones`:'';
}).filter(Boolean);
const date=data.get('eventDate')||'A coordinar';
const details=String(data.get('details')||'').trim();
const lines=[
`¡Hola, Jáuregui Catering & Eventos!`,
`Quisiera recibir una propuesta para mi evento.`,
``,
`*MIS DATOS*`,
`Nombre: ${name}`,
`Celular: ${String(data.get('clientPhone')||'No indicado')}`,
``,
`*DETALLES DEL EVENTO*`,
`Tipo: ${data.get('eventType')}`,
`Fecha: ${date}`,
`Invitados: ${guests} personas`,
`Servicio: ${data.get('serviceType')}`,
``,
`*PLATOS DE MI INTERÉS*`,
...(picked.length?picked:['  - Me gustaría recibir sugerencias de menú.']),
``,
...(details?[`*OTROS DETALLES*`,details,'']:[]),
`Agradeceré que me contacten para conversar sobre las opciones y recibir una cotización.`,
`¡Muchas gracias!`
];
const msg=lines.join('\n');
try{
 const pending=JSON.parse(localStorage.getItem('jauregui-quote-history')||'[]');
 pending.unshift({name,guests,eventType:data.get('eventType'),created:new Date().toISOString(),message:msg});
 localStorage.setItem('jauregui-quote-history',JSON.stringify(pending.slice(0,15)));
}catch{}
const url=whatsappUrl(msg);
const win=window.open(url,'_blank');
if(!win)location.href=url;
$('#formFeedback').textContent='Tu mensaje está listo. Se abrirá WhatsApp para que puedas enviarlo.';
toast('Solicitud lista para WhatsApp');
}
function init(){
$('#year').textContent=new Date().getFullYear();
const saved=localStorage.getItem('jauregui-theme');if(saved==='dark'||(!saved&&matchMedia('(prefers-color-scheme: dark)').matches))document.body.classList.add('dark');
$('#themeToggle').addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('jauregui-theme',document.body.classList.contains('dark')?'dark':'light')});
const menu=$('#mainNav'),toggle=$('#menuToggle');toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'×':'☰'});$$('#mainNav a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}));
$('#searchInput').addEventListener('input',e=>{state.search=e.target.value.trim().toLocaleLowerCase('es');renderDishes()});
$('#categoryFilters').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;state.category=b.dataset.category;state.showFavorites=false;$('#showFavorites').classList.remove('active');renderCategories();renderDishes()});
$('#showFavorites').addEventListener('click',()=>{state.showFavorites=!state.showFavorites;state.category='Todos';$('#showFavorites').classList.toggle('active',state.showFavorites);renderCategories();renderDishes()});
$('#dishGrid').addEventListener('click',e=>{const fav=e.target.closest('[data-favorite]'),add=e.target.closest('[data-add]'),minus=e.target.closest('[data-minus]');if(fav){const id=fav.dataset.favorite;state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);localStorage.setItem('jauregui-favorites',JSON.stringify([...state.favorites]));renderDishes()}else if(add)toggleDish(add.dataset.add);else if(minus)decrementDish(minus.dataset.minus)});
$('#quoteForm').addEventListener('submit',sendQuote);$('#quoteForm [name=guests]').addEventListener('input',updateSummary);
const fallbackDishes=[{"id":"d01","name":"Pique macho","category":"Platos fuertes","description":"Carne de res, salchicha, papa frita, huevo, tomate, cebolla y locoto.","image":"prato-1.webp","price":null,"priceLabel":"Cotizar"},{"id":"d02","name":"Silpancho cochabambino","category":"Platos fuertes","description":"Carne apanada, arroz, papa, huevo frito y ensalada fresca.","image":"prato-2.webp","price":null,"priceLabel":"Cotizar"},{"id":"d03","name":"Sajta de pollo","category":"Platos fuertes","description":"Pollo en salsa de ají amarillo, acompañado de papa y tunta.","image":"prato-3.webp","price":null,"priceLabel":"Cotizar"},{"id":"d04","name":"Fricasé paceño","category":"Platos fuertes","description":"Cerdo en caldo de ají amarillo, mote y chuño.","image":"prato-4.webp","price":null,"priceLabel":"Cotizar"},{"id":"d05","name":"Plato paceño","category":"Platos fuertes","description":"Choclo, habas, papa, queso y llajua.","image":"prato-5.webp","price":null,"priceLabel":"Cotizar"},{"id":"d06","name":"Pollo al horno con guarnición","category":"Platos fuertes","description":"Pollo dorado al horno con papas y acompañamientos.","image":"prato-6.webp","price":null,"priceLabel":"Cotizar"}];
const loadDishes=async()=>{
 try{
  if(location.protocol==='file:') throw new Error('file protocol: use embedded catalog');
  const response=await fetch('./json/platos.json');
  if(!response.ok) throw new Error('catalog request failed');
  const data=await response.json();
  if(!Array.isArray(data)||!data.length) throw new Error('empty catalog');
  return data;
 }catch(error){return fallbackDishes;}
};
loadDishes().then(data=>{state.dishes=data;renderCategories();renderDishes();}).catch(()=>{state.dishes=fallbackDishes;renderCategories();renderDishes();});
if('serviceWorker'in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();