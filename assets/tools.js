(()=>{const $=s=>document.querySelector(s),form=$('#tool-form'),status=$('#status'),path=location.pathname.split('/').pop().replace('.html','');function file(label,id,accept,m=false){return `<label class="field ${m?'full':''}"><span>${label}</span><input id="${id}" type="file" accept="${accept}" ${m?'multiple':''}></label>`}function inp(label,id,type='text',attrs=''){return `<label class="field"><span>${label}</span><input id="${id}" type="${type}" ${attrs}></label>`}function area(label,id,ph=''){return `<label class="field full"><span>${label}</span><textarea id="${id}" placeholder="${ph}"></textarea></label>`}function sel(label,id,opts){return `<label class="field"><span>${label}</span><select id="${id}">${opts.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')}</select></label>`}function setup(fields,fn){form.innerHTML=`<div class="fields">${fields}</div><div class="actions"><button class="btn primary" id="run">Process & download</button><button class="btn" id="reset">Reset</button></div>`;$('#run').onclick=async()=>{status.textContent='Working…';try{await fn()}catch(e){status.textContent='Could not complete: '+(e.message||e)+'. Check the file and internet connection, then try again.'}};$('#reset').onclick=()=>{form.querySelectorAll('input,textarea').forEach(x=>x.value='');status.textContent=''}}function load(src){return new Promise((ok,no)=>{let s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(Error('Could not load required library'));document.head.append(s)})}async function lib(n){let m={jspdf:['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',()=>window.jspdf],pdflib:['https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',()=>window.PDFLib],pdfjs:['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',()=>window.pdfjsLib],mammoth:['https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js',()=>window.mammoth],tesseract:['https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js',()=>window.Tesseract],docx:['https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js',()=>window.docx]}[n];if(!m[1]())await load(m[0]);if(n==='pdfjs')pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'}function dl(b,n){let u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=n;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}function txtdl(t,n){dl(new Blob([t],{type:'text/plain'}),n)}function f(id){let x=$('#'+id).files[0];if(!x)throw Error('Choose a file first');return x}function name(id,d){return (($('#'+id)?.value||d).replace(/\.(pdf|docx)$/i,''))}function img(f){return new Promise((ok,no)=>{let i=new Image(),u=URL.createObjectURL(f);i.onload=()=>{URL.revokeObjectURL(u);ok(i)};i.onerror=no;i.src=u})}
if(path==='text-to-pdf')setup(area('Text','text','Paste your text…')+inp('File name','filename','text','value="document"'),async()=>{await lib('jspdf');let t=$('#text').value;if(!t.trim())throw Error('Enter some text');let d=new jspdf.jsPDF(),y=16;for(let l of d.splitTextToSize(t,175)){if(y>280){d.addPage();y=16}d.text(l,17,y);y+=7}d.save(name('filename','document')+'.pdf');status.textContent='PDF downloaded.'});
else if(path==='text-to-image')setup(area('Text','text','Type text…')+sel('Image size','size',[['1080,1080','Square'],['1200,675','Landscape'],['1080,1350','Portrait']]),async()=>{let t=$('#text').value;if(!t.trim())throw Error('Enter text');let [w,h]=$('#size').value.split(',').map(Number),c=document.createElement('canvas');c.width=w;c.height=h;let x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='#17213a';x.font='36px sans-serif';x.textAlign='center';let ls=[],line='';for(let word of t.split(/\s+/)){let v=line?line+' '+word:word;if(x.measureText(v).width>w-100&&line){ls.push(line);line=word}else line=v}if(line)ls.push(line);let y=Math.max(50,(h-ls.length*48)/2);ls.forEach(l=>{x.fillText(l,w/2,y);y+=48});c.toBlob(b=>dl(b,'text-image.png'),'image/png');status.textContent='PNG downloaded.'});
else if(path==='image-to-text'){
form.innerHTML=`<div class="fields">
${file('Choose image','file','image/*')}
${sel('Recognition language','lang',[['eng','English'],['urd','Urdu'],['ara','Arabic'],['hin','Hindi'],['ben','Bengali'],['fas','Persian / Farsi'],['fra','French'],['deu','German'],['spa','Spanish'],['rus','Russian'],['chi_sim','Chinese (Simplified)'],['eng+ara','English + Arabic'],['eng+urd','English + Urdu']])}
<p class="notice field full">For best results, use a sharp, straight, high-resolution image. Urdu Nastaliq and some scanned fonts can still be difficult for browser OCR. Processing runs in your browser; language data downloads from a CDN.</p>
<label class="field full"><span>Extracted text — edit or proofread</span><textarea id="ocr-result" rows="9" placeholder="Your extracted text will appear here…"></textarea></label>
</div><div class="actions"><button class="btn primary" id="run">Process image</button><button class="btn" id="ocr-download">Download TXT</button><button class="btn" id="reset">Reset</button></div>`;
$('#run').onclick=async()=>{
const input=f('file'); if(!input) {status.textContent='Choose an image first.';return}
$('#run').disabled=true; status.textContent='Loading OCR engine…';
try{
await lib('tesseract'); const im=await img(input);
const scale=Math.min(3,Math.max(1.5,2200/Math.max(im.width,im.height)));
const c=document.createElement('canvas');c.width=Math.round(im.width*scale);c.height=Math.round(im.height*scale);
const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(im,0,0,c.width,c.height);
let imageData=ctx.getImageData(0,0,c.width,c.height),d=imageData.data;
let sum=0; for(let i=0;i<d.length;i+=4) sum+=.299*d[i]+.587*d[i+1]+.114*d[i+2];
const mean=sum/(d.length/4), threshold=Math.max(125,Math.min(205,mean*.88));
const gray=document.createElement('canvas');gray.width=c.width;gray.height=c.height;
const gx=gray.getContext('2d');const gd=gx.createImageData(c.width,c.height);
for(let i=0;i<d.length;i+=4){let v=.299*d[i]+.587*d[i+1]+.114*d[i+2];gd.data[i]=gd.data[i+1]=gd.data[i+2]=v;gd.data[i+3]=255}
gx.putImageData(gd,0,0);
const bin=document.createElement('canvas');bin.width=c.width;bin.height=c.height;const bx=bin.getContext('2d');const bd=bx.createImageData(c.width,c.height);
for(let i=0;i<gd.data.length;i+=4){let v=gd.data[i]>threshold?255:0;bd.data[i]=bd.data[i+1]=bd.data[i+2]=v;bd.data[i+3]=255}bx.putImageData(bd,0,0);
const lang=$('#lang').value;
const candidates=[gray,bin]; let best={text:'',confidence:-1};
for(let n=0;n<candidates.length;n++){
 status.textContent=`Recognizing text (${n+1} of ${candidates.length})…`;
 const blob=await new Promise((ok,no)=>candidates[n].toBlob(b=>b?ok(b):no(Error('Could not prepare image')),'image/png'));
 const r=await Tesseract.recognize(blob,lang,{logger:m=>{if(m.status==='recognizing text')status.textContent=`Recognizing text (${n+1}/${candidates.length})… ${Math.round((m.progress||0)*100)}%`}});
 const text=(r.data.text||'').trim(), conf=Number(r.data.confidence)||0;
 if(text.length>best.text.length && conf>=best.confidence-10)best={text,confidence:conf};
 else if(conf>best.confidence && text.length>best.text.length*.65)best={text,confidence:conf};
}
$('#ocr-result').value=best.text;
status.textContent=best.text?`OCR finished (engine confidence ${Math.round(best.confidence)}%). Please proofread carefully; confidence is not a guarantee of correctness.`:'No readable text detected. Try a sharper, brighter image.';
}catch(e){status.textContent='OCR failed: '+(e.message||e)+'. Check internet access and try again.'}
finally{$('#run').disabled=false}
};
$('#ocr-download').onclick=()=>{let t=$('#ocr-result').value;if(!t.trim()){status.textContent='Process an image first.';return}txtdl(t,'doxlio-extracted-text.txt')};
$('#reset').onclick=()=>{form.querySelectorAll('input,textarea').forEach(x=>x.value='');status.textContent=''};
}
else if(path==='image-resizer')setup(file('Choose image','file','image/*')+inp('Width (px)','width','number','min="1"')+inp('Height (px)','height','number','min="1"')+sel('Format','format',[['image/jpeg','JPG'],['image/png','PNG'],['image/webp','WebP']])+inp('Quality (1–100)','quality','number','min="1" max="100" value="85"'),async()=>{let im=await img(f('file')),w=+$('#width').value||im.width,h=+$('#height').value||im.height,c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);let fmt=$('#format').value;c.toBlob(b=>dl(b,'resized-image.'+({'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[fmt])),fmt,Math.min(1,Math.max(.1,(+$('#quality').value||85)/100)));status.textContent='Image downloaded. Width/height may alter aspect ratio.'});
else if(path==='image-to-pdf')setup(file('Choose image','file','image/*')+inp('File name','filename','text','value="image-document"'),async()=>{let im=await img(f('file'));await lib('jspdf');let c=document.createElement('canvas');c.width=im.width;c.height=im.height;c.getContext('2d').drawImage(im,0,0);let d=new jspdf.jsPDF({orientation:im.width>im.height?'landscape':'portrait',unit:'px',format:[im.width,im.height]});d.addImage(c.toDataURL('image/jpeg',.95),'JPEG',0,0,im.width,im.height);d.save(name('filename','image-document')+'.pdf');status.textContent='PDF downloaded.'});
else if(path==='pdf-to-text')setup(file('Choose PDF','file','.pdf'),async()=>{let x=f('file');await lib('pdfjs');let d=await pdfjsLib.getDocument({data:await x.arrayBuffer()}).promise,o=[];for(let n=1;n<=d.numPages;n++){status.textContent=`Reading page ${n}/${d.numPages}`;let p=await d.getPage(n),c=await p.getTextContent();o.push(c.items.map(i=>i.str).join(' '))}let t=o.join('\n\n');if(!t.trim()){status.textContent='No selectable text found. This PDF may be scanned and require OCR.';return}let l=document.createElement('label');l.className='field full';l.innerHTML='<span>Extracted text</span><textarea id="extracted"></textarea>';form.append(l);$('#extracted').value=t;let b=document.createElement('button');b.className='btn';b.textContent='Download TXT';b.onclick=()=>txtdl($('#extracted').value,'pdf-text.txt');form.append(b);status.textContent='Text extracted; review layout and reading order.'});
else if(path==='merge-pdf')setup(file('Choose two or more PDFs','files','.pdf',true),async()=>{let fs=[...$('#files').files];if(fs.length<2)throw Error('Choose at least two PDFs');await lib('pdflib');let out=await PDFLib.PDFDocument.create();for(let x of fs){let d=await PDFLib.PDFDocument.load(await x.arrayBuffer()),p=await out.copyPages(d,d.getPageIndices());p.forEach(v=>out.addPage(v))}dl(new Blob([await out.save()],{type:'application/pdf'}),'merged.pdf');status.textContent='Merged PDF downloaded.'});
else if(path==='split-pdf')setup(file('Choose PDF','file','.pdf')+inp('First page','start','number','min="1" value="1"')+inp('Last page','end','number','min="1" value="1"'),async()=>{await lib('pdflib');let d=await PDFLib.PDFDocument.load(await f('file').arrayBuffer()),s=+$('#start').value,e=+$('#end').value;if(s<1||e<s||e>d.getPageCount())throw Error(`Page range must be 1–${d.getPageCount()}`);let out=await PDFLib.PDFDocument.create(),p=await out.copyPages(d,Array.from({length:e-s+1},(_,i)=>s-1+i));p.forEach(v=>out.addPage(v));dl(new Blob([await out.save()],{type:'application/pdf'}),'split-pages.pdf');status.textContent='Selected pages downloaded.'});
else if(path==='rotate-pdf')setup(file('Choose PDF','file','.pdf')+sel('Rotation','angle',[['90','90° clockwise'],['180','180°'],['270','270° clockwise']]),async()=>{await lib('pdflib');let d=await PDFLib.PDFDocument.load(await f('file').arrayBuffer()),a=+$('#angle').value;d.getPages().forEach(p=>p.setRotation(PDFLib.degrees((p.getRotation().angle+a)%360)));dl(new Blob([await d.save()],{type:'application/pdf'}),'rotated.pdf');status.textContent='Rotated PDF downloaded.'});
else if(path==='pdf-to-jpg')setup(file('Choose PDF','file','.pdf')+inp('Page number','page','number','min="1" value="1"'),async()=>{await lib('pdfjs');let d=await pdfjsLib.getDocument({data:await f('file').arrayBuffer()}).promise,n=+$('#page').value;if(n<1||n>d.numPages)throw Error(`Page must be from 1 to ${d.numPages}`);let p=await d.getPage(n),v=p.getViewport({scale:1.7}),c=document.createElement('canvas');c.width=v.width;c.height=v.height;await p.render({canvasContext:c.getContext('2d'),viewport:v}).promise;c.toBlob(b=>dl(b,`page-${n}.jpg`),'image/jpeg',.92);status.textContent='JPG downloaded.'});
else if(path==='word-to-pdf')setup(file('Choose DOCX','file','.docx')+'<p class="notice field full">Text-only conversion. Complex layout, tables and images are not preserved.</p>',async()=>{await lib('mammoth');let r=await mammoth.extractRawText({arrayBuffer:await f('file').arrayBuffer()});await lib('jspdf');let d=new jspdf.jsPDF(),y=16;for(let l of d.splitTextToSize(r.value,175)){if(y>280){d.addPage();y=16}d.text(l,17,y);y+=7}d.save('word-text-converted.pdf');status.textContent='Basic PDF downloaded; compare with original.'});
else if(path==='text-to-word')setup(area('Text','text','Paste text…')+inp('File name','filename','text','value="document"'),async()=>{if(!$('#text').value.trim())throw Error('Enter text');await lib('docx');let d=new docx.Document({sections:[{children:$('#text').value.split('\n').map(s=>new docx.Paragraph(s))}]});dl(await docx.Packer.toBlob(d),name('filename','document')+'.docx');status.textContent='DOCX downloaded.'});
else if(path==='resume-builder'||path==='cover-letter-builder'){
const isResume=path==='resume-builder';
form.innerHTML=isResume?`<div class="fields">
${inp('Full name','name')}${inp('Email','email','email')}${inp('Phone','phone')}${inp('Target role','role')}
${sel('Resume template','template',[['modern','Modern professional'],['classic','Classic ATS-friendly'],['accent','Accent sidebar style']])}
${sel('Profile photo','photo-mode',[['no','No photo (recommended for ATS)'],['yes','Include photo']])}
<label class="field full" id="photo-field" hidden><span>Upload profile photo (optional)</span><input id="photo" type="file" accept="image/*"></label>
${area('Professional summary','summary','2–4 lines about your experience and strengths')}
${area('Work experience','experience','Job title | Company | Dates\\nAchievements and responsibilities')}
${area('Education','education','Degree | Institution | Year')}
${area('Skills','skills','Separate skills with commas or new lines')}
${inp('PDF file name','filename','text','value="resume"')}
</div><div class="actions"><button class="btn primary" id="preview-doc">Preview resume</button><button class="btn" id="download-doc" disabled>Save PDF</button><button class="btn" id="reset">Reset</button></div><section class="preview-wrap" id="preview-wrap" hidden><div class="preview-head"><div><h3>Live resume preview</h3><p class="muted">Edit the fields above, then tap Preview resume again. Save PDF when satisfied.</p></div><span class="preview-tag">A4 DOCUMENT</span></div><div id="resume-preview" class="paper-preview"></div></section>`:
`<div class="fields">
${inp('Your name','name')}${inp('Email','email','email')}${inp('Company','company')}${inp('Hiring manager','manager')}${inp('Job title','role')}
${sel('Letter template','template',[['modern','Modern professional'],['classic','Classic formal'],['accent','Accent header']])}
${area('Letter text','body','Write your tailored cover letter here…')}
${inp('PDF file name','filename','text','value="cover-letter"')}
</div><div class="actions"><button class="btn primary" id="preview-doc">Preview cover letter</button><button class="btn" id="download-doc" disabled>Save PDF</button><button class="btn" id="reset">Reset</button></div><section class="preview-wrap" id="preview-wrap" hidden><div class="preview-head"><div><h3>Live cover letter preview</h3><p class="muted">Edit the fields above, then tap Preview again before saving.</p></div><span class="preview-tag">A4 DOCUMENT</span></div><div id="resume-preview" class="paper-preview"></div></section>`;
let latestBlob=null,photoData=null;
if(isResume){$('#photo-mode').addEventListener('change',()=>$('#photo-field').hidden=$('#photo-mode').value!=='yes');$('#photo').addEventListener('change',async()=>{const f=$('#photo').files[0];if(!f){photoData=null;return}try{const im=await img(f),c=document.createElement('canvas');c.width=im.width;c.height=im.height;c.getContext('2d').drawImage(im,0,0);photoData=c.toDataURL('image/jpeg',.88)}catch(e){status.textContent='Could not read profile photo.'}})}
const esc=t=>String(t||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function makePreview(){
const nameVal=$('#name').value.trim()||(isResume?'Your Name':'Your Name'),email=$('#email').value.trim(),role=$('#role').value.trim(),template=$('#template').value;
const accent=template==='classic'?'#334155':template==='accent'?'#00877f':'#6255e7';
if(isResume){
const phone=$('#phone').value.trim(),fields=[['Professional summary',$('#summary').value],['Work experience',$('#experience').value],['Education',$('#education').value],['Skills',$('#skills').value]];
return `<article class="resume-sheet theme-${template}" style="--doc-accent:${accent}"><header class="resume-top">${photoData&&$('#photo-mode').value==='yes'?`<img class="resume-photo" src="${photoData}" alt="Profile photo">`:''}<div><h1>${esc(nameVal)}</h1>${role?`<p class="resume-role">${esc(role)}</p>`:''}<p class="resume-contact">${[email,phone].filter(Boolean).map(esc).join(' &nbsp; · &nbsp; ')}</p></div></header>${fields.filter(x=>x[1].trim()).map(([h,v])=>`<section class="resume-section"><h2>${esc(h)}</h2><div>${esc(v).replace(/\n/g,'<br>')}</div></section>`).join('')}</article>`;
}
const company=$('#company').value.trim(),manager=$('#manager').value.trim(),body=$('#body').value.trim();
return `<article class="letter-sheet theme-${template}" style="--doc-accent:${accent}"><header><h1>${esc(nameVal)}</h1><p>${esc(email)}</p></header>${company?`<p>${esc(company)}</p>`:''}${manager?`<p>Dear ${esc(manager)},</p>`:''}${role?`<p class="letter-re">Re: ${esc(role)}</p>`:''}<div class="letter-body">${esc(body).replace(/\n\s*\n/g,'</p><p>').replace(/\n/g,'<br>')}</div><p class="letter-sign">Sincerely,<br>${esc(nameVal)}</p></article>`;
}
function addText(doc,text,x,y,w,size=10,step=5.2){doc.setFontSize(size);const lines=doc.splitTextToSize(String(text||''),w);for(const line of lines){if(y>277){doc.addPage();y=18}doc.text(line,x,y);y+=step}return y}
function addHeading(doc,label,y,accent){if(y>270){doc.addPage();y=18}doc.setFillColor(...accent);doc.roundedRect(16,y-4,178,8,1.5,1.5,'F');doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text(label.toUpperCase(),20,y+1.5);doc.setTextColor(35,45,68);doc.setFont('helvetica','normal');return y+12}
$('#preview-doc').onclick=()=>{
if(isResume&&!$('#name').value.trim()){status.textContent='Please enter your full name.';return}
if(!isResume&&!$('#body').value.trim()){status.textContent='Please enter your cover letter text.';return}
$('#resume-preview').innerHTML=makePreview();$('#preview-wrap').hidden=false;$('#download-doc').disabled=false;status.textContent='Preview is ready. Edit any fields above and preview again before saving.';
};
$('#download-doc').onclick=async()=>{
try{
if(!$('#resume-preview').innerHTML){status.textContent='Create a preview first.';return}
$('#download-doc').disabled=true;status.textContent='Creating your PDF…';await lib('jspdf');
const {jsPDF}=window.jspdf,doc=new jsPDF({unit:'mm',format:'a4'}),template=$('#template').value;
const accent=template==='classic'?[51,65,85]:template==='accent'?[0,135,127]:[98,85,231];
let y=20;
if(isResume){
const nameVal=$('#name').value.trim(),role=$('#role').value.trim(),email=$('#email').value.trim(),phone=$('#phone').value.trim();
if(template==='accent'){doc.setFillColor(...accent);doc.rect(0,0,210,7,'F');y=24}
doc.setTextColor(...accent);doc.setFont('helvetica','bold');doc.setFontSize(24);doc.text(nameVal,16,y);y+=9;
if(role){doc.setTextColor(80,89,106);doc.setFont('helvetica','normal');y=addText(doc,role,16,y,role.length>55?170:178,11,6)}
doc.setTextColor(90,98,112);doc.setFontSize(9);const contact=[email,phone].filter(Boolean).join('  |  ');if(contact)y=addText(doc,contact,16,y,178,9,5);
if(photoData&&$('#photo-mode').value==='yes'){doc.addImage(photoData,'JPEG',166,12,27,27,'profile','FAST')}
y+=8;
for(const [heading,value] of [['Professional summary',$('#summary').value],['Work experience',$('#experience').value],['Education',$('#education').value],['Skills',$('#skills').value]]){
if(!value.trim())continue;y=addHeading(doc,heading,y,accent);y=addText(doc,value,16,y,178,10,5.3)+7;
}
}else{
const nameVal=$('#name').value.trim(),email=$('#email').value.trim(),company=$('#company').value.trim(),manager=$('#manager').value.trim(),role=$('#role').value.trim();
if(template==='accent'){doc.setFillColor(...accent);doc.rect(0,0,210,35,'F');doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(19);doc.text(nameVal||'Your Name',16,19);doc.setFont('helvetica','normal');doc.setFontSize(9);doc.text(email,16,27);doc.setTextColor(35,45,68);y=50}
else{doc.setTextColor(...accent);doc.setFont('helvetica','bold');doc.setFontSize(20);doc.text(nameVal||'Your Name',16,y);y+=8;doc.setTextColor(75,84,102);doc.setFont('helvetica','normal');doc.setFontSize(10);if(email){doc.text(email,16,y);y+=7}}
if(company)y=addText(doc,company,16,y,178,10,5.5)+4;
y+=5;if(manager)y=addText(doc,'Dear '+manager+',',16,y,178,10,5.5)+5;
if(role)y=addText(doc,'Re: '+role,16,y,178,10,5.5)+7;
for(const para of $('#body').value.trim().split(/\n\s*\n/)){y=addText(doc,para,16,y,178,11,6)+5}
y+=5;addText(doc,'Sincerely,',16,y,178,10,5.5);addText(doc,nameVal,16,y+12,178,10,5.5);
}
const blob=doc.output('blob');dl(blob,(($('#filename').value|| (isResume?'resume':'cover-letter')).trim().replace(/[^a-z0-9-_]+/gi,'-')||'document')+'.pdf');status.textContent='PDF downloaded. The on-page preview remains available for edits.';
}catch(e){status.textContent='Could not create PDF: '+(e.message||e)}finally{$('#download-doc').disabled=false}
};
$('#reset').onclick=()=>{form.querySelectorAll('input,textarea').forEach(x=>{if(x.type==='file')x.value='';else x.value=''});if(isResume)$('#photo-mode').value='no';if($('#photo-field'))$('#photo-field').hidden=true;photoData=null;latestBlob=null;$('#download-doc').disabled=true;$('#preview-wrap').hidden=true;$('#resume-preview').innerHTML='';status.textContent=''};
}
else if(path==='document-scanner'){
form.innerHTML=`<div class="fields">
<label class="field full"><span>Take a photo or choose document images</span><input id="scan-files" type="file" accept="image/*" capture="environment" multiple></label>
${sel('Scan enhancement','scan-mode',[['color','Original color'],['gray','Grayscale document'],['bw','Black & white high contrast']])}
${sel('Page size','scan-size',[['a4','A4 page'],['fit','Fit image to page']])}
<p class="notice field full">Tip: place paper on a contrasting flat surface, keep the camera parallel, and use bright even light. This browser scanner enhances images; it does not yet detect/crop page corners automatically.</p>
</div><div id="scan-preview-grid" class="scan-preview-grid"></div><div class="actions"><button class="btn primary" id="scan-process">Prepare scan</button><button class="btn" id="scan-pdf" disabled>Save scanned PDF</button><button class="btn" id="scan-reset">Reset</button></div>`;
let scans=[];
function renderScans(){const grid=$('#scan-preview-grid');grid.innerHTML=scans.map((x,i)=>`<div class="scan-thumb"><img src="${x.data}" alt="Scanned page ${i+1}"><div><strong>Page ${i+1}</strong><button type="button" class="btn scan-remove" data-index="${i}">Remove</button></div></div>`).join('');grid.querySelectorAll('.scan-remove').forEach(b=>b.onclick=()=>{scans.splice(Number(b.dataset.index),1);renderScans();$('#scan-pdf').disabled=!scans.length})}
$('#scan-files').addEventListener('change',async e=>{try{scans=[];for(const file of e.target.files){const im=await img(file),c=document.createElement('canvas');const scale=Math.min(1,2400/Math.max(im.width,im.height));c.width=Math.round(im.width*scale);c.height=Math.round(im.height*scale);c.getContext('2d').drawImage(im,0,0,c.width,c.height);scans.push({data:c.toDataURL('image/jpeg',.94),name:file.name})}renderScans();$('#scan-pdf').disabled=true;status.textContent=`${scans.length} image(s) selected. Tap Prepare scan to enhance.`}catch(err){status.textContent='Could not read image: '+err.message}});
$('#scan-process').onclick=async()=>{if(!scans.length){status.textContent='Choose or take at least one photo first.';return}try{status.textContent='Enhancing scan pages…';const mode=$('#scan-mode').value;for(const item of scans){const im=await img(await (await fetch(item.data)).blob()),c=document.createElement('canvas');c.width=im.width;c.height=im.height;const ctx=c.getContext('2d');ctx.drawImage(im,0,0);if(mode!=='color'){const id=ctx.getImageData(0,0,c.width,c.height),d=id.data;for(let i=0;i<d.length;i+=4){let v=.299*d[i]+.587*d[i+1]+.114*d[i+2];if(mode==='bw')v=v>165?255:0;d[i]=d[i+1]=d[i+2]=v}ctx.putImageData(id,0,0)}item.data=c.toDataURL('image/jpeg',.94)}renderScans();$('#scan-pdf').disabled=false;status.textContent='Scan ready. Review the page images, then save as PDF.'}catch(e){status.textContent='Could not enhance scans: '+e.message}};
$('#scan-pdf').onclick=async()=>{if(!scans.length)return;try{await lib('jspdf');const {jsPDF}=window.jspdf;let doc=null;for(let i=0;i<scans.length;i++){const im=await img(await (await fetch(scans[i].data)).blob());const landscape=im.width>im.height; if(i===0)doc=new jsPDF({orientation:landscape?'landscape':'portrait',unit:'mm',format:$('#scan-size').value==='a4'?'a4':[im.width*.2646,im.height*.2646]});else doc.addPage($('#scan-size').value==='a4'?'a4':[im.width*.2646,im.height*.2646],landscape?'landscape':'portrait');const pw=doc.internal.pageSize.getWidth(),ph=doc.internal.pageSize.getHeight(),r=Math.min((pw-12)/im.width,(ph-12)/im.height),w=im.width*r,h=im.height*r;doc.addImage(scans[i].data,'JPEG',(pw-w)/2,(ph-h)/2,w,h,'scan'+i,'FAST')}doc.save('doxlio-scanned-document.pdf');status.textContent='Scanned PDF downloaded.'}catch(e){status.textContent='Could not create PDF: '+e.message}};
$('#scan-reset').onclick=()=>{scans=[];$('#scan-files').value='';renderScans();$('#scan-pdf').disabled=true;status.textContent=''};
}

else form.innerHTML='<p>Tool workspace could not be initialized.</p>';})();