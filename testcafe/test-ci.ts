import * as httpserver from 'http-server';
import * as rq from 'request-promise';
import * as createTestCafe from 'testcafe';
/**
 *  This runs the ci test assuming that the following steps have already been run:
 *  * npm run build
 *  * npm run mesh-daemon
 */

(async () => {
    await meshReady();
    const server = startHttpServer();
    try {
        const failed = await runTests();
        process.exitCode = failed ? 1 : 0;
    } finally {
        server.close();
    }
})().catch(err => console.error(err));

/**
 * Waits until mesh is ready to take requests.
 */
async function meshReady() {
    while (true) {
        console.log('Waiting for mesh startup...');
        try {
            await rq.get('http://localhost:8080/api/v2/demo');
            console.log('Mesh is ready!');
            break;
        } catch (err) {
            await wait(1000);
        }
    }
}

function wait(ms: number) {
    return new Promise(res => setTimeout(res, ms));
}

function startHttpServer() {
    console.log('Starting http server...');
    const server = httpserver.createServer({
        root: 'dist',
        proxy: 'http://localhost:8080'
    });
    server.listen(4200);
    return server;
}

async function runTests() {
    const testcafe = await (createTestCafe as any)('localhost', 1337, 1338);
    const failedCount = await testcafe
        .createRunner()
        .browsers(['chrome:headless --window-size=1920x1080'])
        .run();
    testcafe.close();
    return failedCount > 0;
}
