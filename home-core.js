function homeProjectList(projects,query='',starred=[],onlyStarred=false,sort='recent'){
 const q=query.toLocaleLowerCase().trim(),stars=new Set(starred);
 return projects.filter(p=>p&&typeof p.id==='string'&&typeof p.name==='string'&&(!onlyStarred||stars.has(p.id))&&p.name.toLocaleLowerCase().includes(q)).slice().sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):(Number.isFinite(b.updated)?b.updated:0)-(Number.isFinite(a.updated)?a.updated:0)||a.name.localeCompare(b.name));
}
function homeProjectPreview(project){const p=project.pages?.[0]||project;return {width:p.width,height:p.height,background:p.background,elements:p.elements}}
function homeEditedLabel(value){if(!Number.isFinite(value)||value<=0)return 'Saved project';return 'Edited '+new Date(value).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}
