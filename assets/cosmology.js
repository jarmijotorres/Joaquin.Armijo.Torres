(() => {
  const C = 299792.458, $ = id => document.getElementById(id), canvas = $('distance-plot'), ctx = canvas.getContext('2d');
  const format = (value, digits = 0) => new Intl.NumberFormat('en-US', {maximumFractionDigits: digits}).format(value);
  const integral = (fn, upper, steps = 500) => { if (!upper) return 0; const n = steps % 2 ? steps + 1 : steps, h = upper / n; let sum = fn(0) + fn(upper); for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * fn(i * h); return sum * h / 3; };
  const dc = (z, h0, om) => C / h0 * integral(x => 1 / Math.sqrt(om * (1 + x) ** 3 + 1 - om), z);
  function values(z, h0, om) { const comoving = dc(z, h0, om); return {dc:comoving, da:comoving/(1+z), dl:comoving*(1+z)}; }
  function draw() {
    const h0=+$('h0').value, om=+$('om').value, z=+$('z').value, fsky=+$('fsky').value, quantity=$('quantity').value, label={dc:'Comoving distance, D₍C₎',da:'Angular-diameter distance, D₍A₎',dl:'Luminosity distance, D₍L₎'}[quantity];
    $('h0-value').value=h0.toFixed(1); $('om-value').value=om.toFixed(3); $('ol-value').value=(1-om).toFixed(3); $('z-value').value=z.toFixed(2); $('selected-z').value=z.toFixed(2); $('fsky-value').value=fsky.toFixed(3);
    const selected=values(z,h0,om), points=Array.from({length:101},(_,i)=>{const x=i/20;return[x,values(x,h0,om)[quantity]]}), selectedDistance=selected[quantity];
    $('distance-at-z').textContent=format(selectedDistance); $('dc-value').textContent=format(selected.dc); $('da-value').textContent=format(selected.da); $('dl-value').textContent=format(selected.dl); $('sky-area').textContent=format(fsky*41252.96); $('volume-value').textContent=format((4*Math.PI/3*fsky*selected.dc**3)/1e9,3);
    const dpr=devicePixelRatio||1, box=canvas.getBoundingClientRect(), width=Math.max(320,box.width), height=355; canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    const pad={l:60,r:24,t:25,b:46}, maxY=Math.ceil(Math.max(...points.map(p=>p[1]))/500)*500||500, sx=x=>pad.l+x/5*(width-pad.l-pad.r), sy=y=>height-pad.b-y/maxY*(height-pad.t-pad.b); ctx.font='11px DM Mono, monospace';ctx.fillStyle='#62706c';ctx.strokeStyle='#d8ddd5';ctx.lineWidth=1;
    for(let i=0;i<=5;i++){const x=sx(i);ctx.beginPath();ctx.moveTo(x,pad.t);ctx.lineTo(x,height-pad.b);ctx.stroke();ctx.fillText(i,x-3,height-22)} for(let y=0;y<=maxY;y+=maxY/4){const py=sy(y);ctx.beginPath();ctx.moveTo(pad.l,py);ctx.lineTo(width-pad.r,py);ctx.stroke();ctx.fillText(y===0?'0':y>=1000?`${(y/1000).toFixed(1)}k`:format(y),12,py+4)}
    ctx.save();ctx.translate(15,height/2);ctx.rotate(-Math.PI/2);ctx.fillText(`${label} [Mpc]`,0,0);ctx.restore();ctx.fillText('redshift, z',width-92,height-6);ctx.strokeStyle='#204941';ctx.lineWidth=3;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(sx(x),sy(y)):ctx.moveTo(sx(x),sy(y)));ctx.stroke();ctx.strokeStyle='#d0e73b';ctx.lineWidth=1.5;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(sx(z),pad.t);ctx.lineTo(sx(z),height-pad.b);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#d0e73b';ctx.beginPath();ctx.arc(sx(z),sy(selectedDistance),5,0,Math.PI*2);ctx.fill();
  }
  ['h0','om','z','fsky','quantity'].forEach(id=>$(id).addEventListener('input',draw)); $('reset').addEventListener('click',()=>{$('h0').value=67.4;$('om').value=.315;$('z').value=1;$('fsky').value=.1;$('quantity').value='dc';draw()}); window.addEventListener('resize',draw);draw();
})();
