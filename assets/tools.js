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
</div><div class="actions"><button class="btn primary" id="preview-doc">Preview resume</button><button class="btn" id="download-doc" disabled>Save PDF</button><button class="btn" id="reset">Reset</button></div><section class="preview-wrap" id="preview-wrap" hidden><h3>Resume preview</h3><p class="muted">Review the PDF below before saving.</p><iframe id="pdf-preview" title="Resume PDF preview" style="width:100%;height:620px;border:1px solid #dfe3ef;border-radius:12px;background:white"></iframe></section>`:
`<div class="fields">
${inp('Your name','name')}${inp('Email','email','email')}${inp('Company','company')}${inp('Hiring manager','manager')}${inp('Job title','role')}
${sel('Letter template','template',[['modern','Modern professional'],['classic','Classic formal'],['accent','Accent header']])}
${area('Letter text','body','Write your tailored cover letter here…')}
${inp('PDF file name','filename','text','value="cover-letter"')}
</div><div class="actions"><button class="btn primary" id="preview-doc">Preview cover letter</button><button class="btn" id="download-doc" disabled>Save PDF</button><button class="btn" id="reset">Reset</button></div><section class="preview-wrap" id="preview-wrap" hidden><h3>Cover letter preview</h3><p class="muted">Review the PDF below before saving.</p><iframe id="pdf-preview" title="Cover letter PDF preview" style="width:100%;height:620px;border:1px solid #dfe3ef;border-radius:12px;background:white"></iframe></section>`;
let latestBlob=null,previewUrl=null;
if(isResume){$('#photo-mode').addEventListener('change',()=>$('#photo-field').hidden=$('#photo-mode').value!=='yes')}
function addWrapped(doc,text,x,y,width,size=10,step=5.2){doc.setFontSize(size);const lines=doc.splitTextToSize(String(text||''),width);for(const line of lines){if(y>275){doc.addPage();y=18}doc.text(line,x,y);y+=step}return y}
function sectionTitle(doc,label,x,y,width,color){if(y>270){doc.addPage();y=20}doc.setFillColor(...color);doc.roundedRect(x,y-4,width,8,1.5,1.5,'F');doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text(label.toUpperCase(),x+3,y+1.5);doc.setTextColor(35,45,68);doc.setFont('helvetica','normal');return y+12}
$('#preview-doc').onclick=async()=>{
try{
if(isResume&&!$('#name').value.trim())throw Error('Please enter your full name.');
if(!isResume&&!$('#body').value.trim())throw Error('Please enter your cover letter text.');
$('#preview-doc').disabled=true;status.textContent='Building PDF preview…';await lib('jspdf');
const {jsPDF}=window.jspdf;const doc=new jsPDF({unit:'mm',format:'a4'});const template=$('#template').value;
const accent=template==='classic'?[47,61,83]:template==='accent'?[0,133,132]:[95,78,220];
let y=18;
if(isResume){
const nameVal=$('#name').value.trim(),role=$('#role').value.trim(),email=$('#email').value.trim(),phone=$('#phone').value.trim();
if(template==='accent'){doc.setFillColor(...accent);doc.rect(0,0,8,297,'F');}
doc.setTextColor(...accent);doc.setFont('helvetica','bold');doc.setFontSize(template==='classic'?21:25);doc.text(nameVal,template==='accent'?18:16,y);y+=9;
doc.setTextColor(75,84,102);doc.setFont('helvetica','normal');doc.setFontSize(10);
if(role)y=addWrapped(doc,role,template==='accent'?18:16,y,175,11,6);
if(email||phone)y=addWrapped(doc,[email,phone].filter(Boolean).join('  |  '),template==='accent'?18:16,y,175,9,5);
if($('#photo-mode').value==='yes'&&$('#photo').files[0]){const file=$('#photo').files[0];if(!file.type.startsWith('image/'))throw Error('Choose a valid profile image.');const data=await new Promise((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>resolve(fr.result);fr.onerror=()=>reject(Error('Could not read photo'));fr.readAsDataURL(file)});doc.addImage(data,file.type==='image/png'?'PNG':'JPEG',165,14,27,27,undefined,'FAST');}
y+=5;const x=template==='accent'?18:16,w=template==='accent'?174:178;
for(const [heading,value] of [['Professional summary',$('#summary').value],['Work experience',$('#experience').value],['Education',$('#education').value],['Skills',$('#skills').value]]){
if(!value.trim())continue;y=sectionTitle(doc,heading,x,y,w,accent);y=addWrapped(doc,value,x,y,w,10,5.3)+5;
}
}else{
const nameVal=$('#name').value.trim(),email=$('#email').value.trim(),company=$('#company').value.trim(),manager=$('#manager').value.trim(),role=$('#role').value.trim();
if(template==='accent'){doc.setFillColor(...accent);doc.rect(0,0,210,34,'F');doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(18);doc.text(nameVal||'Cover Letter',16,19);doc.setFont('helvetica','normal');doc.setFontSize(10);doc.text(email,16,27);y=48}else{doc.setTextColor(...accent);doc.setFont('helvetica','bold');doc.setFontSize(19);doc.text(nameVal||'Cover Letter',16,y);y+=8;doc.setTextColor(75,84,102);doc.setFont('helvetica','normal');doc.setFontSize(10);if(email){doc.text(email,16,y);y+=7}}
if(template==='classic'){doc.setDrawColor(...accent);doc.setLineWidth(.8);doc.line(16,y,194,y);y+=10}
for(const v of [company,manager?'Dear '+manager+',':'',role?'Re: '+role:''])if(v){y=addWrapped(doc,v,16,y,178,10,5.5)+3}
y+=4;const body=$('#body').value.trim();for(const para of body.split(/\\n\\s*\\n/)){y=addWrapped(doc,para,16,y,178,11,6)+4}
y+=5;y=addWrapped(doc,'Sincerely,',16,y,178,10,5)+4;addWrapped(doc,nameVal,16,y,178,10,5);
}
latestBlob=doc.output('blob');if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=URL.createObjectURL(latestBlob);$('#pdf-preview').src=previewUrl;$('#preview-wrap').hidden=false;$('#download-doc').disabled=false;status.textContent='Preview ready. Review the PDF, then select Save PDF.';
}catch(e){status.textContent=e.message||'Could not build PDF preview.'}
finally{$('#preview-doc').disabled=false}
};
$('#download-doc').onclick=()=>{if(!latestBlob){status.textContent='Create a preview first.';return}dl(latestBlob,name('filename',isResume?'resume':'cover-letter')+'.pdf');status.textContent='PDF saved. Please proofread before sending.'};
$('#reset').onclick=()=>{form.querySelectorAll('input,textarea').forEach(x=>{if(x.type==='file')x.value='';else x.value=''});if(isResume)$('#photo-mode').value='no';$('#photo-field')&&($('#photo-field').hidden=true);latestBlob=null;$('#download-doc').disabled=true;$('#preview-wrap').hidden=true;status.textContent=''};
}
else form.innerHTML='<p>Tool workspace could not be initialized.</p>';})();