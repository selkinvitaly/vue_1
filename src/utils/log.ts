export function logVersion(projectName: string, version: string, env: string): void {
    console.log(`%c${projectName}: ${version} (${env})`, 'font-weight:bold;font-size:1.2em;color:#007bbc');
}
