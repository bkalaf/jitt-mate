/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
(Symbol.prototype as any).dispose??= Symbol('@@Symbol.dispose');
(Symbol.prototype as any).asyncDispose??= Symbol('@@Symbol.asyncDispose');
(Symbol.prototype as any).metadata??= Symbol('@@Symbol.metadata');
(Symbol.prototype as any).convertToRealm??= Symbol('@@Symbol.convertToRealm');
(Symbol.prototype as any).convertFromRealm??= Symbol('@@Symbol.convertFromRealm');
(Symbol.prototype as any).calculatedFields??= Symbol('@@Symbol.calculatedFields');
(Symbol.prototype as any).init??= Symbol('@@Symbol.init');
(Symbol.prototype as any).setValues ??= Symbol('@@Symbol.setValues');
(Symbol.prototype as any).getValues ??= Symbol('@@Symbol.getValues');
(Symbol.prototype as any).setDefaultValues ??= Symbol('@@Symbol.setDefaultValues');
(Symbol as any).metadata = Symbol('Symbol.metadata');
import Realm from 'realm';
import { createRoot } from 'react-dom/client';
import './assets/css/app.css';
import { App } from './components/App';
// import './dal/index6';

console.log('👋 This message is being logged by "renderer.js", included via webpack');

const el = document.getElementById('app-root');
if (el == null) throw new Error('no el');
const root = createRoot(el);
root.render(<App />);
