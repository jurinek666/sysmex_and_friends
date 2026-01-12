import { existsSync } from 'fs';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// #region agent log
fetch('http://127.0.0.1:7242/ingest/3a03f1e8-5044-4fd7-a566-9802511bf37d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'check-rehype-raw.mjs:12',message:'Starting dependency check',data:{packageName:'rehype-raw'},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A'})}).catch(()=>{});
// #endregion

const packageJsonPath = join(rootDir, 'package.json');
const nodeModulesPath = join(rootDir, 'node_modules', 'rehype-raw');

// #region agent log
fetch('http://127.0.0.1:7242/ingest/3a03f1e8-5044-4fd7-a566-9802511bf37d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'check-rehype-raw.mjs:18',message:'Checking package.json',data:{packageJsonPath,exists:existsSync(packageJsonPath)},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A'})}).catch(()=>{});
// #endregion

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const inPackageJson = packageJson.dependencies?.hasOwnProperty('rehype-raw') || 
                      packageJson.devDependencies?.hasOwnProperty('rehype-raw');

// #region agent log
fetch('http://127.0.0.1:7242/ingest/3a03f1e8-5044-4fd7-a566-9802511bf37d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'check-rehype-raw.mjs:24',message:'Package.json check result',data:{inPackageJson,inDependencies:!!packageJson.dependencies?.['rehype-raw'],inDevDependencies:!!packageJson.devDependencies?.['rehype-raw']},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A'})}).catch(()=>{});
// #endregion

const inNodeModules = existsSync(nodeModulesPath);

// #region agent log
fetch('http://127.0.0.1:7242/ingest/3a03f1e8-5044-4fd7-a566-9802511bf37d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'check-rehype-raw.mjs:30',message:'Node modules check result',data:{inNodeModules,nodeModulesPath},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'B'})}).catch(()=>{});
// #endregion

console.log('Diagnostic Results:');
console.log(`- rehype-raw in package.json: ${inPackageJson}`);
console.log(`- rehype-raw in node_modules: ${inNodeModules}`);

// #region agent log
fetch('http://127.0.0.1:7242/ingest/3a03f1e8-5044-4fd7-a566-9802511bf37d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'check-rehype-raw.mjs:36',message:'Final diagnostic summary',data:{inPackageJson,inNodeModules,conclusion:!inPackageJson && !inNodeModules ? 'MISSING_DEPENDENCY' : inPackageJson && !inNodeModules ? 'NOT_INSTALLED' : 'UNKNOWN'},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'C'})}).catch(()=>{});
// #endregion
