import { mount } from 'svelte';
import './app.css';
import { gs } from '$lib/commands.svelte';
import { buildMenu } from '$lib/menu';
import App from './App.svelte';

await buildMenu(gs);

const app = mount(App, {
	target: document.getElementById('app')!
});

export default app;
