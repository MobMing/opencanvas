// Rebuild this library expansion and each later app layer in dependency order.
const {spawnSync}=require('node:child_process'),path=require('node:path');
const root=path.resolve(__dirname,'..');
for(const file of ['build-promo.cjs','build-plus.cjs','build-font-library.cjs','build-print.cjs','build-productivity.cjs','build-layout.cjs','build-svg.cjs','build-projects.cjs','scripts/check-source.cjs']){
 const run=spawnSync(process.execPath,[file],{cwd:root,stdio:'inherit'});if(run.error)throw run.error;if(run.status!==0)process.exit(run.status||1);
}
