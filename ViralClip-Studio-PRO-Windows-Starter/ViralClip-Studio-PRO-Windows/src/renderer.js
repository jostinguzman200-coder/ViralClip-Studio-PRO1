let selected=null;
const $=id=>document.getElementById(id);
async function choose(){
  try{
    const file=await window.viralclip.pickVideo(); if(!file)return;
    selected=file; $('preview').src=file.url; $('preview').hidden=false; $('dropzone').hidden=true;
    $('filename').textContent=file.name; $('projectState').textContent='Video cargado'; $('exportBtn').disabled=false;
    $('message').textContent='Video listo. Define el inicio y el final de tu clip.';
    $('preview').onloadedmetadata=()=>{ $('end').value=Math.floor($('preview').duration||30); };
  }catch(e){$('message').textContent=e.message;}
}
$('importBtn').addEventListener('click',choose); $('chooseBtn').addEventListener('click',choose);
$('exportBtn').addEventListener('click',async()=>{
  if(!selected)return;
  $('exportBtn').disabled=true; $('message').textContent='Exportando en este equipo…';
  try{const r=await window.viralclip.exportClip({input:selected.path,start:$('start').value,end:$('end').value,crop:$('vertical').checked});
    $('message').textContent=r.canceled?'Exportación cancelada.':`Clip exportado correctamente: ${r.path}`;
  }catch(e){$('message').textContent='Error: '+e.message;}finally{$('exportBtn').disabled=false;}
});
