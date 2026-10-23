import http from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const root=path.resolve(process.argv[2]),output=path.resolve(process.argv[3]);
await mkdir(output,{recursive:true});
const server=http.createServer(async(req,res)=>{
 try {const p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!p.startsWith(root+'/')){res.writeHead(403);res.end();return;}
 const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg'};res.setHeader('Content-Type',types[path.extname(p)]||'application/octet-stream');res.end(await readFile(p));}catch{res.writeHead(404);res.end();}
});
await new Promise(r=>server.listen(6008,'127.0.0.1',r));
let browser;
try{browser=await chromium.launch({executablePath:process.env.QA_CHROMIUM_EXECUTABLE,args:['--no-sandbox','--disable-gpu','--use-gl=angle','--use-angle=swiftshader','--disable-features=Vulkan'],headless:true});
 const entries=Object.values(JSON.parse(await readFile(path.join(root,'index.json'),'utf8')).entries).filter(e=>e.type==='story');
 for(const e of entries){const p=await browser.newPage({viewport:{width:e.name==='Small'?375:e.name==='Medium'?744:1920,height:1080}});const errors=[];p.on('pageerror',x=>errors.push(x.message));await p.goto(`http://127.0.0.1:6008/iframe.html?id=${e.id}&viewMode=story`);await p.locator('#storybook-root').waitFor();await p.waitForTimeout(300);assert.equal(errors.length,0,errors.join('\n'));assert.equal(await p.getByText('Oops! Something went wrong').count(),0);
 if(['UI/DetailCard','Features/Mypage/CreatedMeetingsView'].includes(e.title)&&['Large','Medium','Small'].includes(e.name)){await p.getByRole('article').first().waitFor();await p.evaluate(()=>document.fonts.ready);const box=await p.getByRole('article').first().boundingBox();assert.equal(box.width,{Large:958,Medium:696,Small:343}[e.name]);assert.equal(box.height,e.name==='Small'?(e.title==='UI/DetailCard'?390:280):236);if(e.title.includes('CreatedMeetings')){assert.equal(await p.getByText('이용 예정',{exact:true}).count(),0);await p.getByRole('article').first().screenshot({path:path.join(output,`created-card-${e.name.toLowerCase()}-option.png`)});}console.log(`PASS ${e.title} ${e.name}: ${box.width} x ${box.height}`);}
 await p.close();}console.log(`PASS all ${entries.length} stories`);
}finally{await browser?.close();await new Promise(r=>server.close(r));}
